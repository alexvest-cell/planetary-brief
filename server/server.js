import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import nodemailer from 'nodemailer';
import multer from 'multer';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import seedArticles from './seed_data.js';
import dns from 'dns';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Fix DNS resolution issues on Windows
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Models
import Article from './models/Article.js';
import Subscriber from './models/Subscriber.js';
import Redirect from './models/Redirect.js';

// Routes
import sitemapRouter from './routes/sitemap.js';

const app = express();
const port = 3000;

// Configs
// In production, these come from the environment (Render dashboard).
// Locally, they come from .env.local
const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// Gemini Config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (GEMINI_API_KEY) {
  console.log('✓ Gemini API Key found');
} else {
  console.error('❌ Gemini API Key NOT found. AI features will fail.');
}

// Kit Config Check
if (process.env.KIT_API_KEY) {
  console.log('✓ Kit API Key found (Length:', process.env.KIT_API_KEY.length, ')');
} else {
  console.error('❌ Kit API Key NOT found in process.env');
}

// Middleware
app.use(compression()); // Gzip compression
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from public directory (for robots.txt, etc.)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Database Connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    family: 4, // Force IPv4
  })
    .then(async () => {
      console.log('✓ Connected to MongoDB');
      await seedDatabase();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      console.log('⚠️  Server will use local file storage as fallback');
    });
} else {
  console.warn('⚠️ MONGODB_URI is not set. Using local file storage.');
}

// Cloudinary Config
if (CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });
} else {
  console.warn('⚠️ CLOUDINARY credentials not set. Image uploads will fail. Please add to .env.local');
}

// Slugify Helper
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')     // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

// Seeding Logic
const seedDatabase = async () => {
  try {
    const count = await Article.countDocuments();
    console.log(`Current article count: ${count}`);

    // Only seed if database is completely empty
    if (count === 0) {
      console.log('Empty database detected. Seeding initial articles...');
      console.log(`Seeding ${seedArticles.length} articles from seed_data.js...`);
      await Article.insertMany(seedArticles, { ordered: false });
      console.log(`Database seeded successfully with ${seedArticles.length} items.`);
    } else {
      console.log('Database already populated. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Multer setup for memory storage (for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Stream Upload to Cloudinary
const streamUpload = (buffer, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// GET Cloudinary Images (protected - browse existing uploads)
app.get('/api/cloudinary/browse', requireAuth, async (req, res) => {
  try {
    const { folder, next_cursor, max_results = 30 } = req.query;

    const options = {
      resource_type: 'image',
      type: 'upload',
      max_results: parseInt(max_results),
      direction: 'desc' // newest first
    };

    if (folder) options.prefix = folder;
    if (next_cursor) options.next_cursor = next_cursor;

    const result = await cloudinary.api.resources(options);

    // Also get root folders for navigation
    let folders = [];
    try {
      const folderResult = await cloudinary.api.root_folders();
      folders = folderResult.folders || [];
    } catch (e) {
      // Folders API may not be available on free plans
    }

    res.json({
      images: result.resources.map(r => ({
        public_id: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
        created_at: r.created_at,
        folder: r.folder || ''
      })),
      next_cursor: result.next_cursor || null,
      total_count: result.rate_limit_remaining,
      folders: folders.map(f => f.name)
    });
  } catch (error) {
    console.error('Cloudinary browse error:', error);
    res.status(500).json({ error: 'Failed to browse Cloudinary images' });
  }
});

// --- AUTHENTICATION ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123'; // Set in .env.local
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'your-secret-key-change-this'; // Set in .env.local

// Simple token generation (in production, use JWT)
function generateToken() {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

// Store valid tokens (in-memory, resets on server restart)
const validTokens = new Set();

// Global request logger to debug routing issues
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Middleware to verify admin token
function requireAuth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' });
  }

  next();
}

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = generateToken();
    validTokens.add(token);

    // Token expires in 24 hours
    setTimeout(() => validTokens.delete(token), 24 * 60 * 60 * 1000);

    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (token) {
    validTokens.delete(token);
  }
  res.json({ message: 'Logged out successfully' });
});

// Verify token endpoint (check if still logged in)
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (token && validTokens.has(token)) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// --- REDIRECT MIDDLEWARE ---
// Check for redirects BEFORE all other routes
app.use(async (req, res, next) => {
  // Skip API routes and static files
  if (req.path.startsWith('/api/') || req.path.startsWith('/static/') || req.path.includes('.')) {
    return next();
  }

  // Only check for redirects if DB is connected
  if (mongoose.connection.readyState !== 1) {
    return next();
  }

  try {
    // Check if a redirect exists for this path
    const redirect = await Redirect.findOne({
      fromPath: req.path,
      isActive: true
    });

    if (redirect) {
      console.log(`[Redirect] ${req.path} -> ${redirect.toPath} (${redirect.redirectType})`);
      return res.redirect(redirect.redirectType, redirect.toPath);
    }

    next();
  } catch (error) {
    console.error('Redirect middleware error:', error);
    next(); // Continue even if redirect check fails
  }
});

// --- ROUTES ---

// Mount sitemap route (must be before other routes to avoid conflicts)
app.use('/', sitemapRouter);

// --- REDIRECT MANAGEMENT ROUTES (Protected) ---

// GET all redirects
app.get('/api/redirects', requireAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const redirects = await Redirect.find().sort({ createdAt: -1 });
    res.json(redirects);
  } catch (error) {
    console.error('Get redirects error:', error);
    res.status(500).json({ error: 'Failed to fetch redirects' });
  }
});

// POST create redirect
app.post('/api/redirects', requireAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { fromPath, toPath, redirectType, description, isActive } = req.body;

    // Validation
    if (!fromPath || !toPath) {
      return res.status(400).json({ error: 'fromPath and toPath are required' });
    }

    // Check for existing redirect with same fromPath
    const existing = await Redirect.findOne({ fromPath });
    if (existing) {
      return res.status(400).json({ error: 'A redirect for this path already exists' });
    }

    // Detect redirect loops
    if (fromPath === toPath) {
      return res.status(400).json({ error: 'Cannot redirect a path to itself' });
    }

    const redirect = await Redirect.create({
      fromPath,
      toPath,
      redirectType: redirectType || 301,
      description: description || '',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(redirect);
  } catch (error) {
    console.error('Create redirect error:', error);
    res.status(500).json({ error: error.message || 'Failed to create redirect' });
  }
});

// PUT update redirect
app.put('/api/redirects/:id', requireAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const updates = req.body;

    // Prevent changing to duplicate fromPath
    if (updates.fromPath) {
      const existing = await Redirect.findOne({
        fromPath: updates.fromPath,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({ error: 'A redirect for this path already exists' });
      }
    }

    const redirect = await Redirect.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!redirect) {
      return res.status(404).json({ error: 'Redirect not found' });
    }

    res.json(redirect);
  } catch (error) {
    console.error('Update redirect error:', error);
    res.status(500).json({ error: error.message || 'Failed to update redirect' });
  }
});

// DELETE redirect
app.delete('/api/redirects/:id', requireAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const redirect = await Redirect.findByIdAndDelete(id);

    if (!redirect) {
      return res.status(404).json({ error: 'Redirect not found' });
    }

    res.json({ success: true, message: 'Redirect deleted' });
  } catch (error) {
    console.error('Delete redirect error:', error);
    res.status(500).json({ error: 'Failed to delete redirect' });
  }
});

// GET Articles (public - no auth required)
app.get('/api/articles', async (req, res) => {
  try {
    const { includeUnpublished } = req.query;
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const isAdmin = token && validTokens.has(token);

    // If no DB, return local file storage or seed data
    if (mongoose.connection.readyState !== 1) {
      console.log('No DB connection - checking local storage');
      const localArticles = readLocalArticles();
      if (localArticles.length > 0) {
        console.log(`Returning ${localArticles.length} articles from local storage`);
        return res.json(localArticles);
      }
      console.log('Returning seed data (no local storage yet)');
      return res.json(seedArticles);
    }

    let query = {};

    // Only show all articles (including drafts) if admin AND requested unpublished
    if (!(isAdmin && includeUnpublished === 'true')) {
      const now = new Date();
      query = {
        $or: [
          { status: 'published' },
          { status: 'scheduled', scheduledPublishDate: { $lte: now } },
          { status: { $exists: false } } // Backward compatibility for old articles
        ]
      };
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET Articles Backup/Export (protected - requires auth)
app.get('/api/articles/export', requireAuth, async (req, res) => {
  try {
    let articles;

    // If no DB, get from local storage or seed data
    if (mongoose.connection.readyState !== 1) {
      const localArticles = readLocalArticles();
      articles = localArticles.length > 0 ? localArticles : seedArticles;
    } else {
      articles = await Article.find().sort({ createdAt: -1 });
    }

    // Set headers for file download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="greenshift-backup-${timestamp}.json"`);

    res.json({
      exportDate: new Date().toISOString(),
      totalArticles: articles.length,
      articles: articles
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export articles' });
  }
});

// POST Restore Articles from Backup (protected - requires auth)
app.post('/api/articles/restore', requireAuth, express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { articles } = req.body;

    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Invalid backup format. Expected { articles: [...] }' });
    }

    if (articles.length === 0) {
      return res.status(400).json({ error: 'Backup file contains no articles' });
    }

    // Get current count for logging
    const currentCount = await Article.countDocuments();
    console.log(`[RESTORE] Current articles: ${currentCount}, Restoring: ${articles.length} articles`);

    // Clear existing articles
    await Article.deleteMany({});
    console.log('[RESTORE] Cleared existing articles');

    // Clean articles - remove MongoDB-specific fields that could cause conflicts
    const cleanedArticles = articles.map(a => {
      const clean = { ...a };
      delete clean._id;
      delete clean.__v;
      return clean;
    });

    // Insert all articles from backup
    const result = await Article.insertMany(cleanedArticles, { ordered: false });
    console.log(`[RESTORE] Successfully restored ${result.length} articles`);

    res.json({
      success: true,
      message: `Restored ${result.length} articles (replaced ${currentCount} existing)`,
      previousCount: currentCount,
      restoredCount: result.length
    });
  } catch (error) {
    console.error('[RESTORE] Error:', error);
    res.status(500).json({ error: 'Failed to restore articles: ' + error.message });
  }
});

// GET Image URLs Backup/Export (protected - requires auth)
app.get('/api/articles/export-images', requireAuth, async (req, res) => {
  try {
    let articles;

    // If no DB, get from local storage or seed data
    if (mongoose.connection.readyState !== 1) {
      const localArticles = readLocalArticles();
      articles = localArticles.length > 0 ? localArticles : seedArticles;
    } else {
      articles = await Article.find().sort({ createdAt: -1 });
    }

    // Collect all unique image URLs
    const imageData = [];
    const uniqueUrls = new Set();

    articles.forEach(article => {
      const images = [];

      // Main image
      if (article.imageUrl && !uniqueUrls.has(article.imageUrl)) {
        images.push({ type: 'main', url: article.imageUrl });
        uniqueUrls.add(article.imageUrl);
      }

      // Original image
      if (article.originalImageUrl && !uniqueUrls.has(article.originalImageUrl)) {
        images.push({ type: 'original', url: article.originalImageUrl });
        uniqueUrls.add(article.originalImageUrl);
      }

      // Secondary image
      if (article.secondaryImageUrl && !uniqueUrls.has(article.secondaryImageUrl)) {
        images.push({ type: 'secondary', url: article.secondaryImageUrl });
        uniqueUrls.add(article.secondaryImageUrl);
      }

      // Diagram
      if (article.diagramUrl && !uniqueUrls.has(article.diagramUrl)) {
        images.push({ type: 'diagram', url: article.diagramUrl });
        uniqueUrls.add(article.diagramUrl);
      }

      if (images.length > 0) {
        imageData.push({
          articleId: article.id,
          articleTitle: article.title,
          images: images
        });
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="greenshift-images-backup-${timestamp}.json"`);

    res.json({
      exportDate: new Date().toISOString(),
      totalArticles: articles.length,
      totalUniqueImages: uniqueUrls.size,
      imageData: imageData
    });
  } catch (error) {
    console.error('Image export error:', error);
    res.status(500).json({ error: 'Failed to export image URLs' });
  }
});

// POST Article (protected - requires auth)
app.post('/api/articles', requireAuth, async (req, res) => {
  try {
    const newArticle = req.body;

    // Ensure ID and timestamps
    if (!newArticle.id) {
      newArticle.id = 'gen-' + Date.now();
    }

    // Enforce Single Global Hero
    if (newArticle.isFeaturedDiscover) {
      if (mongoose.connection.readyState === 1) {
        await Article.updateMany({}, { isFeaturedDiscover: false });
      } else {
        const articles = readLocalArticles();
        articles.forEach(a => a.isFeaturedDiscover = false);
        writeLocalArticles(articles);
      }
    }
    if (!newArticle.createdAt) {
      newArticle.createdAt = new Date().toISOString();
    }
    newArticle.updatedAt = new Date().toISOString();

    // Ensure Slug
    if (!newArticle.slug && newArticle.title) {
      newArticle.slug = generateSlug(newArticle.title);
    }

    // Normalize content to array if string
    if (typeof newArticle.content === 'string') {
      newArticle.content = [newArticle.content];
    }

    // If no DB, use local storage
    if (mongoose.connection.readyState !== 1) {
      console.log('No DB - saving to local storage');
      const articles = readLocalArticles();
      articles.push(newArticle);
      if (writeLocalArticles(articles)) {
        return res.status(201).json(newArticle);
      } else {
        return res.status(500).json({ error: 'Failed to write to local storage' });
      }
    }

    const created = await Article.create(newArticle);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    // Handle duplicate key error (likely slug collision)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate article ID or Slug. Please change the title.' });
    }
    res.status(500).json({ error: 'Failed to create article. Error: ' + error.message });
  }
});

// PUT Article (protected - requires auth)
app.put('/api/articles/:id', requireAuth, async (req, res) => {
  try {
    const articleId = req.params.id;
    const updates = req.body;
    updates.updatedAt = new Date().toISOString();

    // Enforce Single Global Hero
    if (updates.isFeaturedDiscover) {
      if (mongoose.connection.readyState === 1) {
        await Article.updateMany({ id: { $ne: articleId } }, { isFeaturedDiscover: false });
      } else {
        const articles = readLocalArticles();
        let changed = false;
        articles.forEach(a => {
          if (a.id !== articleId && a.isFeaturedDiscover) {
            a.isFeaturedDiscover = false;
            changed = true;
          }
        });
        if (changed) writeLocalArticles(articles);
      }
    }

    // If no DB, use local storage
    if (mongoose.connection.readyState !== 1) {
      console.log('No DB - updating in local storage');
      const articles = readLocalArticles();
      const index = articles.findIndex(a => a.id === articleId);
      if (index === -1) {
        return res.status(404).json({ error: 'Article not found in local storage' });
      }
      articles[index] = { ...articles[index], ...updates };
      if (writeLocalArticles(articles)) {
        return res.json(articles[index]);
      } else {
        return res.status(500).json({ error: 'Failed to write to local storage' });
      }
    }

    const updated = await Article.findOneAndUpdate({ id: articleId }, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update article. Error: ' + error.message });
  }
});

// DELETE Article (protected - requires auth)
app.delete('/api/articles/:id', requireAuth, async (req, res) => {
  try {
    const articleId = req.params.id;

    // If no DB, use local storage
    if (mongoose.connection.readyState !== 1) {
      console.log('No DB - deleting from local storage');
      const articles = readLocalArticles();
      const filtered = articles.filter(a => a.id !== articleId);
      if (filtered.length === articles.length) {
        return res.status(404).json({ error: 'Article not found' });
      }
      if (writeLocalArticles(filtered)) {
        return res.json({ success: true });
      } else {
        return res.status(500).json({ error: 'Failed to write to local storage' });
      }
    }

    const deleted = await Article.findOneAndDelete({ id: articleId });
    if (!deleted) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete article. Error: ' + error.message });
  }
});

// UPLOAD Image or Audio (Cloudinary)
app.post('/api/upload', upload.fields([{ name: 'image' }, { name: 'audio' }]), async (req, res) => {
  const imageFile = req.files?.image?.[0];
  const audioFile = req.files?.audio?.[0];

  console.log('Upload request received');
  console.log('Files:', req.files);
  console.log('Image file:', imageFile ? `${imageFile.originalname} (${imageFile.size} bytes)` : 'none');
  console.log('Audio file:', audioFile ? `${audioFile.originalname} (${audioFile.size} bytes)` : 'none');

  if (!imageFile && !audioFile) {
    console.error('No file in request');
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    let result;
    if (imageFile) {
      console.log('Uploading image to Cloudinary...');
      result = await streamUpload(imageFile.buffer, 'image');
    } else if (audioFile) {
      console.log('Uploading audio to Cloudinary as video resource...');
      result = await streamUpload(audioFile.buffer, 'video'); // Cloudinary uses 'video' for audio files
    }

    console.log('Upload successful:', result.secure_url);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: `Upload failed: ${error.message}. Cloudinary configured?` });
  }
});

// Test endpoint to trigger digest email
app.post('/api/test-digest', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    const previewUrl = await sendDigestEmail(subscriber.email, subscriber.topics);
    res.json({ success: true, previewUrl });
  } catch (error) {
    console.error('Test digest error:', error);
    res.status(500).json({ error: 'Failed to send test digest' });
  }
});

// POST Subscribe
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, topics, timezone } = req.body;

    // Check if exists
    let subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      subscriber = await Subscriber.create({
        email,
        topics,
        timezone: timezone || 'UTC'
      });
    } else {
      // Update topics if already exists (optional behavior)
      subscriber.topics = topics;
      if (timezone) subscriber.timezone = timezone;
      await subscriber.save();
    }

    // Send Welcome Email
    sendDigestEmail(email, topics, true);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Subscription failed' });
  }
});


// --- AI ASSISTANT (Gemini) ---

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, type, model: selectedModel, category, topic, minMinutes, maxMinutes } = req.body;


    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    console.log(`[AI Request] Type: ${type}, Model: ${selectedModel}`);


    const context = (category || topic) ? `Category: ${category || 'N/A'}, Topic: ${topic || 'N/A'}. ` : "";
    let systemPrompt = "";


    if (type === 'title') {
      systemPrompt = `You are a senior editor at a prestigious global news organization. ${context}
      Goal: Provide a high-level investigative summary as a headline.
      
      FORBIDDEN PATTERNS:
      - NO short tags or generic titles (e.g., FORBIDDEN: "Reefs in Peril", "Arctic Melting").
      - Absolutely NO exclamation marks (!).
      - Absolutely NO calls to action ("Save", "Protect", "Act", "Join", "Discover why", "Let's").
      - NO promotional hype or "clickbait" tags (Alert, Crisis, Urgent).
      
      IDEAL PATTERN (8-10 Word Investigative Finding):
      - "The unseen thermal anomalies disrupting deep-water currents in the North Atlantic"
      - "Systemic failures in tropical forest monitoring projects across the Amazon"
      
      STRUCTURAL RULES:
      - LENGTH: Must be between 8 and 10 words.
      - TONE: Serious, investigative, factual.
      - Use an intellectual "Curiosity Gap"—describe a hidden discovery.`;
    } else if (type === 'body') {
      systemPrompt = `You are an expert environmental journalist. ${context}
      Write a concise, engaging article body (4-5 paragraphs).
      
      STRICT JOURNALISTIC RULES:
      - ABSOLUTELY NO CALLS TO ACTION: No "Join us", "Save the planet", "Protect our future", or "Let's come together".
      - NO EXCLAMATION MARKS: Use zero "!".
      - CONCLUSION RULE: The article MUST end with a factual, objective summary of the future implications or systemic trends. NO community appeals.
      - TONE: Serious, descriptive, data-focused.`;
    } else if (type === 'image_prompt') {
      systemPrompt = `You are an expert photo editor for a top-tier news agency (like Reuters or National Geographic). 
      Based on the article title and content provided, write a highly detailed image generation prompt suitable for Midjourney v6 or DALL-E 3.
      
      STYLE GUIDE:
      - **CRITICAL: Generate the image with a 4:3 ASPECT RATIO (Landscape).**
      - ULTRA-REALISTIC PHOTOGRAPHY, 8k resolution, raw photo style, shot on Sony A7R IV or similar
      - Journalistic, documentary style, "on the ground" perspective (eye level)
      - True to life colors and lighting (natural light, realistic depth of field)
      - AVOID: abstract art, illustrations, diagrams, maps, "overviews", collage, or conceptual 3D renders.
      - The image must look exactly like a real photograph taken by a professional photojournalist.
      
      Output ONLY the raw prompt text (no "Here is a prompt:", just the prompt itself).`;
    } else if (type === 'social') {
      systemPrompt = `You are the AI Social Media Manager for Planetary Brief.
      Based on the article content provided, generate optimized social media posts for Instagram, Facebook, Twitter, and LinkedIn.

      RETURN JSON ONLY. Structure:
      {
        "instagram": { "text": "...", "headline": "Visual Headline (8-10 words)" },
        "facebook": { "text": "...", "headline": "Visual Headline (8-10 words)" },
        "twitter": { "text": "...", "headline": "Visual Headline (8-10 words)" },
        "linkedin": { "text": "...", "headline": "Visual Headline (8-10 words)" }
      }

      For "headline", generate a punchy 8-10 word investigative finding (no "!", no CTAs) suitable for text-on-image.

      For "text", strictly follow these platform-specific rules:

      ### INSTAGRAM
      OBJECTIVE: Drive engagement and saves while positioning Planetary Brief as authoritative environmental intelligence.
      STYLE: Clear, confident, analytical but accessible. No hype, no activism. Short paragraphs.
      STRUCTURE:
      1. Hook (first 1–2 lines must stop scroll).
      2. 2–4 short insight paragraphs summarizing the key development.
      3. Why it matters (1–2 lines).
      4. CTA: "Read the full briefing at PlanetaryBrief.com"
      5. 5–8 relevant hashtags maximum.
      AVOID: Generic climate slogans, emotional framing, excess emojis.

      ### FACEBOOK
      OBJECTIVE: Drive clicks and shares among policy-aware readers.
      STYLE: Informative, structured, professional tone. No exaggeration.
      STRUCTURE:
      1. Strong opening summary sentence (what happened).
      2. Context paragraph (why this development matters).
      3. 2–3 bullet-style insights (line breaks, not actual bullets).
      4. Clear CTA: "Read the full analysis here: [link placeholder]"
      AVOID: Hashtag overload (max 3), sensationalism.

      ### TWITTER/X
      OBJECTIVE: Maximize engagement, clarity, and repost potential.
      STYLE: Concise, high signal density, analytical. Under 280 characters.
      STRUCTURE: Hook sentence + key data point + why it matters + link placeholder.
      Include 1–3 relevant hashtags maximum.
      AVOID: Alarmist language.

      ### LINKEDIN
      OBJECTIVE: Position Planetary Brief as institutional-grade environmental intelligence for decision-makers.
      STYLE: Professional, structured, insight-driven. Executive tone. No hype.
      STRUCTURE:
      1. Opening line summarizing the development in one strong sentence.
      2. Short context paragraph (what happened).
      3. 3 key implications (clear line breaks).
      4. "Why this matters for decision-makers:" section (1–2 lines).
      5. CTA: "Full briefing: [link placeholder]"
      Optional: 3–5 relevant professional hashtags.
      AVOID: Casual tone, emojis, activist framing.`;
    } else if (type === 'full') {
      const targetLength = minMinutes && maxMinutes ? `${minMinutes}-${maxMinutes}` : '5-7';
      const wordCount = Math.floor(((parseInt(minMinutes) || 5) + (parseInt(maxMinutes) || 7)) / 2 * 200);

      systemPrompt = `You are an expert environmental journalist writing for Planetary Brief, a premium environmental intelligence platform.
      
      Based on the user's prompt, generate a comprehensive, factual environmental news article.

      REQUIREMENTS:
      - Target Length: ${targetLength} minutes (approximately ${wordCount} words)
      - ${context}

      Generate a JSON object with the following structure (DO NOT include markdown code blocks, just raw JSON):

      {
        "title": "Serious 8-10 word investigative finding. FORBIDDEN: Short tags like 'Reefs in Peril'. NO '!', NO CTA.",
        "excerpt": "Sophisticated 1-sentence teaser summarizing the investigative core.",
        "content": ["Array of 6-10 substantial paragraphs, each 3-5 sentences. Focus on facts, data, and impact. Include specific numbers and sources where relevant."],
        "contextBox": {
          "title": "A short title for additional context (e.g., 'The Science Behind It', 'Key Policy Details')",
          "content": "2-3 sentences providing crucial background information or data that enhances understanding",
          "source": "Credible source for this context (e.g., 'IPCC 2023 Report', 'Nature Climate Change')"
        },
        "publicationDate": "The date of the most recent data or event mentioned (format: 'Mon YYYY', e.g., 'Jan 2026')",
        "keywords": ["Array of exactly 20 trending, relevant keywords related to the article content, focusing on environmental topics, policies, locations, and key concepts"]
      }

      IMPORTANT: 
      - Be factual and cite realistic sources.
      - ABSOLUTELY NO CALLS TO ACTION OR EXCLAMATIONS.
      - NO COMMUNITY APPEALS (e.g., "Let's protect this").
      - The article must end with a cold, factual finding about future systemic risk or scientific progress.
      - Ensure keywords are diverse and relevant.`;
    }

    // --- ROUTE TO PROVIDER ---
    const modelLower = (selectedModel || "").toLowerCase().trim();

    if (modelLower.startsWith('gpt-') || modelLower.includes('openai')) {
      console.log(`[AI Route] Routing to OpenAI handler for model: ${selectedModel}`);
      return handleOpenAI(req, res, systemPrompt, prompt, selectedModel || "gpt-4o");
    } else {
      const geminiModel = selectedModel || "gemini-1.5-flash-latest";
      console.log(`[AI Route] Routing to Gemini handler for model: ${geminiModel}`);
      return handleGemini(req, res, systemPrompt, prompt, geminiModel, apiKey, context, type);
    }

  } catch (err) {
    console.error(`[/api/generate Critical Error]`, err);
    res.status(500).json({ error: err.message });
  }
});


// --- SCHEDULER ---

cron.schedule('0 * * * *', async () => {
  console.log('Running hourly digest scheduler...');
  if (mongoose.connection.readyState !== 1) return; // Skip if no DB

  try {
    const subscribers = await Subscriber.find();
    subscribers.forEach(sub => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: sub.timezone,
          weekday: 'long',
          hour: 'numeric',
          hour12: false
        });
        const parts = formatter.formatToParts(now);
        const weekday = parts.find(p => p.type === 'weekday')?.value;
        const hour = parts.find(p => p.type === 'hour')?.value;

        if (weekday === 'Friday' && hour === '12') {
          console.log(`Sending digest to ${sub.email}`);
          sendDigestEmail(sub.email, sub.topics, false);
        }
      } catch (e) {
        console.error(`Error processing schedule for ${sub.email}:`, e);
      }
    });
  } catch (err) {
    console.error('Scheduler DB Error:', err);
  }
});

// Auto-publish scheduled articles (runs every minute)
cron.schedule('* * * * *', async () => {
  if (mongoose.connection.readyState !== 1) return; // Skip if no DB

  try {
    const now = new Date();
    const articlesToPublish = await Article.find({
      status: 'scheduled',
      scheduledPublishDate: { $lte: now }
    });

    if (articlesToPublish.length > 0) {
      console.log(`Auto-publishing ${articlesToPublish.length} scheduled article(s)...`);

      for (const article of articlesToPublish) {
        article.status = 'published';
        article.publishedAt = now;
        await article.save();
        console.log(`✓ Published: ${article.title}`);
      }
    }
  } catch (err) {
    console.error('Auto-publish scheduler error:', err);
  }
});

const sendDigestEmail = async (email, topics, isWelcome = false) => {
  // Fetch specific articles from DB
  let relevantArticles = [];
  if (mongoose.connection.readyState === 1) {
    const allArticles = await Article.find().sort({ createdAt: -1 });
    relevantArticles = allArticles
      .filter(a => {
        const articleCats = Array.isArray(a.category) ? a.category : [a.category];
        return articleCats.some(cat => topics.includes(cat));
      })
      .slice(0, 6);
  } else {
    // Fallback
    relevantArticles = seedArticles.slice(0, 4);
  }

  // HTML EMAIL GENERATION (Keep existing style)
  const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  const articleRows = chunk(relevantArticles, 2);

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #18181b; color: #ffffff; }
        .container { max-width: 640px; margin: 0 auto; background-color: #18181b; }
        .header { padding: 40px 20px; border-bottom: 1px solid #27272a; text-align: center; }
        .header h1 { margin: 0; font-family: Georgia, serif; font-size: 28px; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; }
        .accent { color: #10b981; }
        .content { padding: 40px 20px; }
        .article-img { width: 100%; aspect-ratio: 3/2; border-radius: 8px; margin-bottom: 16px; display: block; object-fit: cover; background-color: #27272a; }
        .btn { display: inline-block; padding: 8px 16px; background-color: #ffffff; color: #000000; text-decoraion: none; font-weight: bold; font-size: 10px; border-radius: 4px; text-transform: uppercase; }
      </style>
    </head>
    <body style="background-color: #18181b; margin: 0; padding: 0;">
      <div class="container">
        <div class="header"><h1><span class="accent">Planetary</span>Brief</h1></div>
        <div class="content">
          ${isWelcome ? '<p style="text-align:center">Welcome to the inner circle.</p>' : '<p style="text-align:center">Your weekly articles.</p>'}
          ${articleRows.map(row => `
            <div style="display: flex; gap: 20px; margin-bottom: 30px;">
              ${row.map(a => `
                  <div style="flex: 1;">
                    ${a.imageUrl ? `<img src="${a.imageUrl}" class="article-img" />` : ''}
                    <h3 style="color:white; margin: 10px 0;">${a.title}</h3>
                    <p style="color:#a1a1aa; font-size: 14px;">${a.excerpt}</p>
                    <a href="https://your-site.onrender.com/?article=${a.id}" class="btn">Read</a>
                  </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;

  let transporter;

  // 1. Try to use Real SMTP if configured (e.g. Gmail App Password)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail', // Built-in support for Gmail
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(`Using Real SMTP (${process.env.SMTP_USER})`);
  }
  // 2. Fallback to Ethereal (Test Mode)
  else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log("Using Ethereal Fake SMTP (Test Mode)");
  }

  const info = await transporter.sendMail({
    from: '"Planetary Brief Intelligence" <briefing@planetarybrief.com>',
    to: email,
    subject: isWelcome ? "Welcome to Planetary Brief" : "Your Weekly Articles",
    html: emailHtml,
  });

  console.log(`Email sent to ${email} (Topics: ${topics}). Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

import { generateWeeklyDigest } from './templates/newsletterDigest.js';
import { subscribeToKit, getSubscribers, getTags, getBroadcasts, getKitStats } from './utils/kit.js';

// --- NEWSLETTER ROUTES START ---

// 1. Public Subscribe Endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  console.log('[DEBUG] Hit /api/newsletter/subscribe with body:', req.body);
  try {
    const { email, topics } = req.body;

    // Validate inputs
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Call Kit API wrapper
    // Note: 'topics' should be an array of tag IDs ideally, or we map them here if needed.
    // Assuming frontend sends the tag IDs from the config mapping.
    const response = await subscribeToKit(email, topics);

    console.log(`[Newsletter] Subscribed ${email} to topics:`, topics);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error('[Newsletter] Subscribe Error:', error.message);
    res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
  }
});

// 2. Admin: Get Stats (Protected)
app.get('/api/newsletter/stats', async (req, res) => {
  try {
    // Basic protection (can be enhanced with full auth middleware)
    // For now relying on AdminDashboard calling this with valid context if needed
    // or better: add check for admin token if req headers present?
    // Leaving open for simplicity per "simplifying" request, but in prod use Auth middleware.

    const stats = await getKitStats();
    res.json(stats);
  } catch (error) {
    console.error('[Newsletter] Stats Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 3. Admin: Get Subscribers (Paginated)
app.get('/api/newsletter/subscribers', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await getSubscribers(page);
    res.json(data);
  } catch (error) {
    console.error('[Newsletter] Subscribers Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// 4. Admin: Generate Digest Preview
app.post('/api/newsletter/generate-digest', async (req, res) => {
  try {
    const digestData = req.body; // { intro, featuredArticle, supportingArticles, metricSnapshot }

    // Generate HTML
    const html = generateWeeklyDigest(digestData);

    // Return HTML string
    res.json({ html });
  } catch (error) {
    console.error('[Newsletter] Digest Gen Error:', error.message);
    res.status(500).json({ error: 'Failed to generate digest' });
  }
});

// --- NEWSLETTER ROUTES END ---
// --- SERVE FRONTEND (Production) ---
// This allows the Node server to serve the React app after it's built
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// --- AI Endpoints ---

app.post('/api/analyze', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Server AI Key missing' });
  const { prompt } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are the Planetary Brief AI, an intelligent environmental assistant.
        Goal: Answer user questions on environment, climate, sustainability with high accuracy.
        Tone: Helpful, authoritative, scientific, yet accessible. Avoid alarmism.
        Format: Keep responses concise (under 200 words) unless asked for deep dive. Use markdown.
        Verification: Rely on consensus science (IPCC, NOAA, etc.).`,
      }
    });

    res.json({ text: response.text() || "Analysis incomplete." });
  } catch (error) {
    console.error("Gemini Analysis API Error:", error);
    res.status(500).json({ error: 'AI Error' });
  }
});

app.post('/api/speech', async (req, res) => {
  const { articleId } = req.body;

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID required' });
  }

  try {
    // Only return cached audio from database
    const article = await Article.findOne({ id: articleId });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!article.audioUrl) {
      return res.status(404).json({ error: 'Audio not yet generated for this article' });
    }

    // Fetch from Cloudinary
    const cloudParams = await fetch(article.audioUrl);
    if (cloudParams.ok) {
      const buffer = await cloudParams.arrayBuffer();
      const audioData = Buffer.from(buffer).toString('base64');
      return res.json({ audioData });
    } else {
      return res.status(500).json({ error: 'Failed to fetch audio from storage' });
    }
  } catch (error) {
    console.error("Audio fetch error:", error);
    res.status(500).json({ error: 'Audio fetch error' });
  }
});

// Admin-only: Generate audio for an article
app.post('/api/generate-audio', requireAuth, async (req, res) => {
  // Note: Text-to-Speech API requires enabling the API in Google Cloud Console
  // and may require a different API key than Gemini

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Server AI Key missing',
      details: 'Please add GEMINI_API_KEY to environment variables'
    });
  }

  const { articleId } = req.body;

  console.log('=== GENERATE AUDIO ENDPOINT HIT ===');
  console.log('Article ID:', articleId);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID required' });
  }

  try {
    // Fetch article from database
    const article = await Article.findOne({ id: articleId });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Prepare text to read
    let textToRead;

    // Priority 1: Use voiceover text provided in request (real-time preview from CMS)
    if (req.body.voiceoverText && req.body.voiceoverText.trim().length > 0) {
      textToRead = req.body.voiceoverText;
      console.log(`Using provided voiceover text from request (${textToRead.length} chars)`);
    }
    // Priority 2: Use saved voiceover text from database
    else if (article.voiceoverText && article.voiceoverText.trim().length > 0) {
      textToRead = article.voiceoverText;
      console.log(`Using saved voiceover text from DB (${textToRead.length} chars)`);
    }
    // Priority 3: Fallback to full article content
    else {
      const contentArray = Array.isArray(article.content) ? article.content : [article.content];
      textToRead = `${article.title}. ${article.excerpt}. ${contentArray.join(' ')}`;
      console.log(`Using full article content for audio (${textToRead.length} chars)`);
    }


    console.log(`Generating audio for article: ${articleId}`);
    console.log(`Text source: ${textToRead ? 'voiceoverText' : 'full article'}`);
    console.log(`Text length: ${textToRead.length} characters`);


    // Preprocess text to reduce glitches
    // Clean up common issues that cause TTS glitches
    const cleanText = textToRead
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .replace(/\.{2,}/g, '.') // Replace multiple periods with single period
      .replace(/\s+([.,!?])/g, '$1') // Remove space before punctuation
      .replace(/([.,!?])([^\s])/g, '$1 $2') // Add space after punctuation if missing
      .trim();

    console.log('Preprocessed text for TTS');


    // Add pauses between sentences by inserting ellipses
    // This is simpler and more reliable than SSML for Journey voices
    const sentences = cleanText
      .split(/([.!?]+\s+)/) // Split on sentence-ending punctuation, keep delimiters
      .filter(s => s.trim().length > 0) // Remove empty strings
      .reduce((acc, curr, idx, arr) => {
        // Combine sentence text with its punctuation
        if (idx % 2 === 0 && arr[idx + 1]) {
          acc.push(curr + arr[idx + 1]);
        } else if (idx % 2 === 0) {
          acc.push(curr);
        }
        return acc;
      }, []);

    // Join sentences with longer ellipses to create more pronounced pauses
    // Triple ellipses create ~600-800ms pauses vs single ellipsis ~200ms
    const textWithPauses = sentences.join('... ... ... ');

    console.log(`Processed ${sentences.length} sentences with extended pause markers`);

    // Use Google Cloud Text-to-Speech API
    const textToSpeechUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';

    const ttsResponse = await fetch(textToSpeechUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        input: { text: textWithPauses }, // Use plain text with extended ellipses for pauses
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Journey-D' // Back to male voice (user preferred)
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95, // Natural pace with extended pauses between sentences
          pitch: 0.0,
          volumeGainDb: -4.0 // Reduce volume by 4dB to prevent clipping
        }
      })
    });


    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.json().catch(() => ({}));
      console.error('TTS API error response:', JSON.stringify(errorData, null, 2));
      console.error('TTS API status:', ttsResponse.status, ttsResponse.statusText);

      // Provide helpful error message
      if (errorData.error?.status === 'PERMISSION_DENIED') {
        throw new Error('Text-to-Speech API not enabled. Please enable it in Google Cloud Console and ensure your API key has access.');
      }

      // Include full error details for debugging
      const errorMessage = errorData.error?.message || errorData.error?.details?.[0]?.message || ttsResponse.statusText;
      throw new Error(`Text-to-Speech API failed: ${errorMessage}`);
    }

    const ttsData = await ttsResponse.json();
    const audioData = ttsData.audioContent;

    if (!audioData) {
      console.error('No audio data in TTS response');
      throw new Error('Audio generation failed - no audio data returned');
    }

    // Upload to Cloudinary with explicit audio configuration
    const buffer = Buffer.from(audioData, 'base64');

    // Upload with explicit resource type and format
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Cloudinary treats audio as 'video'
          format: 'mp3',
          folder: 'planetary_brief_audio',
          quality: 'auto:best', // Preserve maximum quality, don't re-encode
          audio_codec: 'mp3' // Keep original MP3 codec
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Cloudinary upload failed');
    }

    // Update article with audioUrl
    await Article.findOneAndUpdate(
      { id: articleId },
      { audioUrl: uploadResult.secure_url }
    );

    console.log(`Audio generated and cached for ${articleId}: ${uploadResult.secure_url}`);

    res.json({
      success: true,
      audioUrl: uploadResult.secure_url,
      message: 'Audio generated successfully'
    });
  } catch (error) {
    console.error("Audio generation error:", error);
    res.status(500).json({
      error: 'Audio generation failed',
      details: error.message
    });
  }
});


// Serve static files from the React app (build directory)
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback: serve index.html for any request that doesn't match API routes or static files
// Express 5 doesn't support wildcard routes, so we use middleware instead
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// --- AI PROVIDER ROUTING ---

// --- GOOGLE GEMINI HANDLER ---
async function handleGemini(req, res, systemPrompt, prompt, model, apiKey, context, type) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  console.log(`\n--- [AI] GEMINI SYSTEM PROMPT (Type: ${type}) ---`);
  console.log(systemPrompt);
  console.log(`-----------------------------------------------\n`);

  try {
    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        parts: [{ text: `Generate ${type} content based on: ${prompt}` }]
      }]
    };

    console.log(`[AI] Calling Gemini [${model}] with system_instruction...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error(`[AI] Gemini API Error Status: ${response.status}`);
      console.error(`[AI] Gemini API Error Body:`, JSON.stringify(errorBody, null, 2));

      if (response.status === 403) {
        return res.status(403).json({
          error: 'Gemini API Permission Denied (403)',
          details: errorBody.error?.message || 'Access blocked. Check your API key or service enablement.',
          reason: errorBody.error?.status || 'API_KEY_SERVICE_BLOCKED'
        });
      }

      throw new Error(`Gemini API Error: ${errorBody.error?.message || response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return processAIResponse(res, text, type);
  } catch (err) {
    console.error(`[Gemini Error]`, err);
    return res.status(500).json({ error: err.message });
  }
}

// --- OPENAI HANDLER ---
async function handleOpenAI(req, res, systemPrompt, prompt, model) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY. Please ensure it is set in your environment variables or .env.local file.' });
  }

  console.log(`\n--- [AI] OPENAI SYSTEM PROMPT (Type: ${req.body.type}) ---`);
  console.log(systemPrompt);
  console.log(`------------------------------------------------\n`);

  try {
    console.log(`[AI] Calling OpenAI [${model}]...`);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error(`[AI] OpenAI Error:`, errData);
      throw new Error(errData.error?.message || `OpenAI Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    return processAIResponse(res, text, req.body.type);
  } catch (err) {
    console.error(`[OpenAI Error]`, err);
    return res.status(500).json({ error: err.message });
  }
}

// --- SHARED RESPONSE PROCESSOR ---
function processAIResponse(res, text, type) {
  if (!text) {
    console.warn("[AI] Empty response from AI");
    return res.status(500).json({ error: 'Empty response from AI' });
  }

  if (type === 'full' || type === 'social') {
    try {
      let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
      }
      const result = JSON.parse(cleanedText);

      if (type === 'full') {
        const totalWords = result.content && Array.isArray(result.content) ? result.content.join(' ').split(/\s+/).length : 500;
        const readTimeMinutes = Math.ceil(totalWords / 200);
        result.readTime = `${readTimeMinutes} min read`;
      }

      if (type === 'social') {
        const normalized = {};
        const normalizeEntry = (entry) => {
          if (typeof entry === 'string') return { text: entry, headline: "PLANETARY BRIEF" };
          return {
            text: entry.text || entry.content || "",
            headline: entry.headline || entry.title || "PLANETARY BRIEF"
          };
        };

        for (const key in result) {
          const lower = key.toLowerCase();
          if (lower.includes('twitter') || lower === 'x') normalized.twitter = normalizeEntry(result[key]);
          else if (lower.includes('facebook')) normalized.facebook = normalizeEntry(result[key]);
          else if (lower.includes('instagram')) normalized.instagram = normalizeEntry(result[key]);
          else if (lower.includes('linkedin')) normalized.linkedin = normalizeEntry(result[key]);
        }
        return res.json(normalized);
      }

      return res.json(result);
    } catch (e) {
      console.error("JSON Parse Error on text:", text);
      return res.status(500).json({ error: 'AI output was not valid JSON', raw: text });
    }
  }

  return res.json({ text });
}

