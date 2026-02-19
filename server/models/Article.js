import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true }, // Keeping the string ID for frontend compatibility
    slug: { type: String, unique: true, sparse: true }, // URL-friendly slug, sparse index allows nulls
    title: String,
    excerpt: String,
    subheadline: String, // New field for subheadline above image
    content: [String], // Array of paragraphs
    category: [String], // Can be single string or array, we'll store as array ideally, but Mixed works for migration
    imageUrl: String,
    author: String,
    date: String,
    readTime: String,
    tags: [String],
    keywords: [String],
    location: String,
    featuredInDepth: Boolean,
    contextBox: {
        title: String,
        content: String,
        source: String
    },
    sources: [String], // List of specific sources
    audioUrl: String,  // Cloudinary URL

    // Feature Flags
    isFeaturedDiscover: { type: Boolean, default: false }, // Global Hero
    isFeaturedCategory: { type: Boolean, default: false }, // Category Hero

    // New Content Structure Fields (Feb 2026 - Enhanced SEO)
    articleType: {
        type: String,
        enum: ['Policy Brief', 'Data Signal', 'In-Depth Analysis', 'Technology Assessment', 'Treaty Explainer']
    },
    primaryTopic: String, // One of the 6 core pillars
    secondaryTopics: [String], // Up to 5 supporting themes
    whyItMatters: String, // 2-3 sentences explaining systemic relevance
    entities: [String], // Named entities (institutions, treaties, countries, companies, frameworks)
    generalInformation: {
        title: String, // Max 7 words
        text: String, // 60-80 words, snippet-eligible
        sources: String // Named authoritative sources
    },

    // Quarterly Highlights (Feb 2026)
    isQuarterlyHighlight: { type: Boolean, default: false },
    highlightQuarter: {
        type: String,
        enum: ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026', 'Q1-2027', 'Q2-2027', 'Q3-2027', 'Q4-2027']
    },
    quarterlySummaryOverride: String, // Max 160 chars
    highlightPriority: { type: Number, default: 0 },

    // Publishing Status
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'published' },
    scheduledPublishDate: Date,
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now }
}, { strict: false }); // strict: false allows for flexible fields if legacy data varies

export default mongoose.model('Article', articleSchema);
