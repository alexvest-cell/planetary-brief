import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import multer from 'multer';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import seedArticles from './seed_data.js';
import dns from 'dns';
import { GoogleGenAI } from "@google/genai";

// Fix DNS resolution issues on Windows
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Models
import Article from './models/Article.js';
import Subscriber from './models/Subscriber.js';

// Replicate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configs
// In production, these come from the environment (Render dashboard).
// Locally, they come from .env.local
const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

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

// Seeding Logic
async function seedDatabase() {
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      console.log('Seeding database with initial articles...');
      // Ensure seed data format matches schema
      const formattedSeed = seedArticles.map(a => ({
        ...a,
        content: Array.isArray(a.content) ? a.content : [a.content] // Ensure content is array
      }));
      await Article.insertMany(formattedSeed);
      console.log('Seeding complete.');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

// Image Upload Helper
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: "planetary_brief_uploads",
        quality: "auto:best",
        fetch_format: "auto",
        invalidate: true
      },
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

// Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// --- LOCAL FILE STORAGE FALLBACK ---
// When MongoDB is not connected, store articles in a local JSON file
const LOCAL_STORAGE_PATH = path.join(__dirname, 'local_articles.json');

function readLocalArticles() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORAGE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local storage:', err);
  }
  return [];
}

function writeLocalArticles(articles) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(articles, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing local storage:', err);
    return false;
  }
}

// --- AUTHENTICATION ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123'; // Set in .env.local
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'your-secret-key-change-this'; // Set in .env.local

// Simple token generation (in production, use JWT)
function generateToken() {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

// Store valid tokens (in-memory, resets on server restart)
const validTokens = new Set();

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

// --- ROUTES ---

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

    // Only filter if not admin or if admin didn't request unpublished
    if (!isAdmin || includeUnpublished !== 'true') {
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
    if (!newArticle.createdAt) {
      newArticle.createdAt = new Date().toISOString();
    }
    newArticle.updatedAt = new Date().toISOString();

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
    res.status(500).json({ error: 'Failed to create article. Error: ' + error.message });
  }
});

// PUT Article (protected - requires auth)
app.put('/api/articles/:id', requireAuth, async (req, res) => {
  try {
    const articleId = req.params.id;
    const updates = req.body;
    updates.updatedAt = new Date().toISOString();

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

// UPLOAD Image (Cloudinary)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Image upload failed. Cloudinary configured?' });
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }

    // Use Gemini 2.0 Flash
    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    const context = (category || topic) ? `Category: ${category || 'N/A'}, Topic: ${topic || 'N/A'}. ` : "";
    let systemPrompt = "";

    if (type === 'title') {
      systemPrompt = `You are an expert editor. ${context}Write a single, punchy, click-worthy but factual headline for an environmental news article based on this topic. Do not use quotes.`;
    } else if (type === 'body') {
      systemPrompt = `You are an expert environmental journalist. ${context}Write a concise, engaging article body (4-5 paragraphs) based on this prompt. Use markdown formatting. Focus on facts and impact.`;
    } else if (type === 'image_prompt') {
      systemPrompt = `You are an expert photo editor for a top-tier news agency (like Reuters or National Geographic). 
      Based on the article title and content provided, write a highly detailed image generation prompt suitable for Midjourney v6 or DALL-E 3.
      
      STYLE GUIDE:
      - ULTRA-REALISTIC PHOTOGRAPHY, 8k resolution, raw photo style, shot on Sony A7R IV or similar
      - Journalistic, documentary style, "on the ground" perspective (eye level)
      - True to life colors and lighting (natural light, realistic depth of field)
      - AVOID: abstract art, illustrations, diagrams, maps, "overviews", collage, or conceptual 3D renders.
      - The image must look exactly like a real photograph taken by a professional photojournalist.
      
      Output ONLY the raw prompt text (no "Here is a prompt:", just the prompt itself).`;
    } else if (type === 'social') {
      systemPrompt = `You are a social media expert for a premium environmental news platform.
      Based on the article content provided, generate optimized social media posts.

      REQUIREMENTS:
      1. Twitter/X: Concise, punchy, under 280 chars, with 2-3 relevant hashtags.
      2. LinkedIn: Professional tone, slightly longer (3-4 sentences), engaging question or insight, with 3-5 hashtags.
      3. Instagram: Engaging caption, use emojis, focus on the visual/impact aspect, block of hashtags at bottom.
      
      Generate a JSON object (NO markdown):
      {
        "twitter": "Text for X...",
        "linkedin": "Text for LinkedIn...",
        "instagram": "Text for Instagram..."
      }`;
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
        "title": "A compelling, factual headline (10-15 words max)",
        "excerpt": "A 2-3 sentence teaser that hooks the reader and summarizes the key point",
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
      - Be factual and cite realistic sources
      - Use current environmental issues and trends
      - Make the content substantial and informative
      - Ensure keywords are diverse and relevant`;
    }

    const payload = {
      contents: [{
        parts: [{ text: `${systemPrompt}\n\nUser Request: ${prompt}` }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${errText}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

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
          // Normalize Social Data
          const normalized = {};
          for (const key in result) {
            const lower = key.toLowerCase();
            if (lower.includes('twitter') || lower === 'x') normalized.twitter = result[key];
            else if (lower.includes('linkedin')) normalized.linkedin = result[key];
            else if (lower.includes('instagram')) normalized.instagram = result[key];
            else normalized[lower] = result[key];
          }
          return res.json(normalized);
        }

        return res.json(result);
      } catch (jsonErr) {
        console.error("JSON Parse Error:", text);
        return res.status(500).json({ error: `AI produced invalid JSON`, rawText: text });
      }
    }

    res.json({ text });

  } catch (e) {
    console.error("AI Generation Failed:", e);
    res.status(500).json({ error: e.message });
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

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  const info = await transporter.sendMail({
    from: '"Planetary Brief Intelligence" <briefing@planetarybrief.com>',
    to: email,
    subject: isWelcome ? "Welcome to Planetary Brief" : "Your Weekly Articles",
    html: emailHtml,
  });

  console.log(`Email sent to ${email} (Topics: ${topics}). Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

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
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server AI Key missing' });
  }

  const { articleId } = req.body;

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
    const contentArray = Array.isArray(article.content) ? article.content : [article.content];
    const textToRead = `${article.title}. ${article.excerpt}. ${contentArray.join(' ')}`;

    console.log(`Generating audio for article: ${articleId}`);

    // Generate audio via Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: { parts: [{ text: textToRead }] },
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error('Audio generation failed');
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(audioData, 'base64');
    const result = await streamUpload(buffer);

    if (!result || !result.secure_url) {
      throw new Error('Cloudinary upload failed');
    }

    // Update article with audioUrl
    await Article.findOneAndUpdate(
      { id: articleId },
      { audioUrl: result.secure_url }
    );

    console.log(`Audio generated and cached for ${articleId}: ${result.secure_url}`);

    res.json({
      success: true,
      audioUrl: result.secure_url,
      message: 'Audio generated successfully'
    });
  } catch (error) {
    console.error("Audio generation error:", error);
    res.status(500).json({ error: 'Audio generation failed' });
  }
});


// Serve static files from the React app (root)
app.use(express.static(path.join(__dirname, '../')));

// SPA fallback: serve index.html for any request that doesn't match API routes or static files
// Express 5 doesn't support wildcard routes, so we use middleware instead
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
