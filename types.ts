export interface Article {
  id: string;
  slug?: string; // URL-friendly slug generated from title
  title: string;
  subheadline?: string; // Optional subheadline above image
  category: string | string[];
  topic: string;
  source: string;
  imageUrl: string;
  imageAttribution?: string;
  originalImageUrl?: string;
  secondaryImageUrl?: string;
  diagramUrl?: string;
  audioUrl?: string;  // Cloudinary URL for pre-generated audio
  voiceoverText?: string; // Dedicated text for audio narration, extracted from VO tags
  sources?: string[]; // List of specific sources for this article
  excerpt: string;
  date: string;
  originalReadTime: string;
  url: string;
  content: string[];
  createdAt?: string;
  updatedAt?: string;
  isFeaturedDiscover?: boolean;
  isFeaturedCategory?: boolean;
  keywords?: string[];
  seoDescription?: string;
  featuredInDepth?: boolean; // Control for "In-Depth Analysis" homepage section
  contextBox?: {
    title: string;
    content: string;
    source: string;
  };
  imageOffsetX?: number; // X offset percentage (-50 to 50)
  imageOffsetY?: number; // Y offset percentage (-50 to 50)

  // New Content Structure Fields (Feb 2026 - Enhanced SEO)
  articleType?: 'Policy Brief' | 'Data Signal' | 'In-Depth Analysis' | 'Technology Assessment' | 'Treaty Explainer';
  primaryTopic?: string; // One of the 6 core pillars
  secondaryTopics?: string[]; // Up to 5 supporting themes
  whyItMatters?: string; // 2-3 sentences explaining systemic relevance
  entities?: string[]; // Named entities (institutions, treaties, countries, companies, frameworks)

  // Enhanced General Information (replaces/supplements contextBox)
  generalInformation?: {
    title: string; // Max 7 words
    text: string; // 60-80 words, snippet-eligible
    sources: string; // Named authoritative sources
  };

  // Quarterly Highlights (Feb 2026)
  isQuarterlyHighlight?: boolean;
  highlightQuarter?: 'Q1-2025' | 'Q2-2025' | 'Q3-2025' | 'Q4-2025' | 'Q1-2026' | 'Q2-2026' | 'Q3-2026' | 'Q4-2026' | 'Q1-2027' | 'Q2-2027' | 'Q3-2027' | 'Q4-2027';
  quarterlySummaryOverride?: string;
  highlightPriority?: number;

  // Legacy Authority fields
  primaryPillar?: string;
  isCornerstone?: boolean;
  pillarPosition?: number;
  relatedArticleIds?: string[];
  hubIntroduction?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface ExplanationData {
  title: string;
  value?: string;
  trend?: string;
  icon: any; // Using any for Lucide icon component type to avoid complex type imports
  color: string;
  detailedInfo: {
    definition: string;
    context: string;
    impact: string;
  };
  history?: { year: string; value: number }[];
}

export enum Section {
  HERO = 'headlines',
  NEWS = 'latest-news',
  STATUS = 'planetary-status',
  AI_ASSISTANT = 'green-ai',
  ABOUT = 'mission',
  ACTION = 'take-action',
  CONTACT = 'subscribe',
}