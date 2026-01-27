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

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Database Connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedDatabase();
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('⚠️ MONGODB_URI is not set. Database features will fail. Please add it to .env.local');
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
      { folder: "planetary_brief_uploads" },
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

// --- ROUTES ---

// GET Articles
app.get('/api/articles', async (req, res) => {
  try {
    // If no DB, try to return seed data or empty (fallback for local without creds)
    if (mongoose.connection.readyState !== 1) {
      console.log('Returning static seed data (No DB connection)');
      return res.json(seedArticles);
    }
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// POST Article
app.post('/api/articles', async (req, res) => {
  try {
    const newArticle = req.body;

    // Ensure ID
    if (!newArticle.id) {
      newArticle.id = 'gen-' + Date.now();
    }

    // Normalize content to array if string
    if (typeof newArticle.content === 'string') {
      newArticle.content = [newArticle.content];
    }

    const created = await Article.create(newArticle);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create article. DB Connected?' });
  }
});

// PUT Article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const updated = await Article.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// DELETE Article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const deleted = await Article.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
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
          ${isWelcome ? '<p style="text-align:center">Welcome to the inner circle.</p>' : '<p style="text-align:center">Your weekly briefing.</p>'}
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
    subject: isWelcome ? "Welcome to Planetary Brief" : "Your Weekly Intelligence Brief",
    html: emailHtml,
  });

  console.log(`Email sent to ${email} (Topics: ${topics}). Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

// --- SERVE FRONTEND (Production) ---
// This allows the Node server to serve the React app after it's built
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
