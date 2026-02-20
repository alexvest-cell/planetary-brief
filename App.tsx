import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Thermometer, CloudFog, MountainSnow, Droplets, Waves, Bird, Leaf, Flame, Wind, AlertTriangle, Loader2 } from 'lucide-react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio'; // Acts as Home/Discover Feed
import CategoryFeed from './components/CategoryFeed'; // New Category Page
import PlanetaryStatus from './components/PlanetaryStatus';
import About from './components/About';
import AdUnit from './components/AdUnit';
import { ADS_CONFIG } from './data/adsConfig';
import Action from './components/Action';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import { AudioProvider } from './contexts/AudioContext';
import { Section, Article, ExplanationData } from './types';
import { featuredArticle, newsArticles as staticNewsArticles } from './data/content';
import LatestPolicySection from './components/LatestPolicySection';
import DataSignalsSection from './components/DataSignalsSection';
import InDepthAnalysisSection from './components/InDepthAnalysisSection';
import TopicHubsSection from './components/TopicHubsSection';
import { homepageConfig } from './data/homepageConfig';
import { updateMetaTags } from './utils/seoUtils';

// Code splitting: Lazy load heavy components
const ArticleView = lazy(() => import('./components/ArticleView'));
const EarthDashboard = lazy(() => import('./components/EarthDashboard'));
const DataExplanationView = lazy(() => import('./components/DataExplanationView'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const SubscribeModal = lazy(() => import('./components/SubscribeModal'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./components/TermsOfUse'));
const Archives = lazy(() => import('./components/Archives'));
const TagArchive = lazy(() => import('./components/TagArchive'));


// Helper to restore icon component lost in JSON serialization
const restoreIcon = (data: any): ExplanationData => {
  const title = data.title || data.label; // Handle potential variations
  let IconComponent = Thermometer; // Default

  if (title === "Global Mean Temp" || title === "Permafrost Thaw") IconComponent = Thermometer;
  else if (title.includes("CO₂") || title.includes("Carbon")) IconComponent = CloudFog;
  else if (title.includes("Ice Sheet") || title.includes("West Antarctic")) IconComponent = MountainSnow;
  else if (title === "Sea Level Rise") IconComponent = Droplets;
  else if (title === "Ocean Acidity") IconComponent = Waves;
  else if (title === "Biodiversity") IconComponent = Bird;
  else if (title === "Forest Loss" || title.includes("Rainforest")) IconComponent = Leaf;
  else if (title.includes("Methane")) IconComponent = Flame;
  else if (title.includes("Atlantic Circulation") || title.includes("AMOC")) IconComponent = Wind;
  else if (title.includes("Limit") || title.includes("Warning")) IconComponent = AlertTriangle;

  return { ...data, icon: IconComponent };
};

// Helper functions for clean URLs
const categoryToSlug = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const slugToCategory = (slug: string): string => {
  const categoryMap: Record<string, string> = {
    // Legacy Slugs -> New Categories
    'climate-change': 'Climate & Energy Systems',
    'energy': 'Climate & Energy Systems',
    'pollution': 'Planetary Health & Society',
    'policy-and-economics': 'Policy, Governance & Finance',
    'oceans': 'Biodiversity & Oceans',
    'biodiversity': 'Biodiversity & Oceans',
    'conservation': 'Biodiversity & Oceans',
    'solutions': 'Technology & Innovation',
    // New 5-Pillar Slugs
    'climate-and-energy-systems': 'Climate & Energy Systems',
    'planetary-health-and-society': 'Planetary Health & Society',
    'policy-governance-and-finance': 'Policy, Governance & Finance',
    'biodiversity-and-oceans': 'Biodiversity & Oceans',
    'technology-and-innovation': 'Technology & Innovation'
  };
  return categoryMap[slug] || slug;
};

// Helper to get multiple articles by ID
const getArticlesByIds = (ids: string[], allArticles: Article[]) => {
  return ids.map(id => allArticles.find(a => a.id === id)).filter(Boolean) as Article[];
};

function App() {
  // Search now includes all dynamic articles
  // Browser History Management: All view changes push state to history API,
  // allowing the browser back/forward buttons to work correctly across the entire site
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);
  const [view, setView] = useState<'home' | 'category' | 'article' | 'sources' | 'dashboard' | 'explanation' | 'about' | 'subscribe' | 'admin' | 'privacy' | 'terms' | 'archives' | 'tag-archive'>(() => {
    // Initialize view from URL
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (hash === '#explain') return 'explanation';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/about') return 'about';

    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    if (path === '/archives') return 'archives';
    if (path.startsWith('/tag/')) return 'tag-archive';
    // Admin, subscribe, etc could be added
    return 'home';
  });

  // Hydrate history state on mount to ensure back button works for initial entry
  useEffect(() => {
    if (!window.history.state) {
      const path = window.location.pathname;
      let initialState: any = { view: 'home' };

      if (path === '/dashboard') initialState = { view: 'dashboard' };
      else if (path === '/about') initialState = { view: 'about' };
      else if (path === '/about') initialState = { view: 'about' };

      window.history.replaceState(initialState, '', path);
    }
  }, []);

  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [explanationData, setExplanationData] = useState<ExplanationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTagSlug, setActiveTagSlug] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Dynamic Articles State
  const [articles, setArticles] = useState<Article[]>(staticNewsArticles);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Define fetchArticles outside useEffect to be reusable
  const fetchArticles = async () => {
    try {
      const headers: HeadersInit = {};
      const url = '/api/articles';

      // Note: We don't include unpublished articles on the public site
      // Even for admins - they should use the Admin Dashboard to view drafts

      const res = await fetch(url, { headers });
      if (res.ok) {
        const apiArticles = await res.json();
        if (apiArticles.length > 0) {
          // Sort by createdAt or date (descending)
          const sorted = apiArticles.sort((a: any, b: any) => {
            const getSortableDate = (item: any) => {
              if (item.date) {
                const normalized = item.date
                  .replace(/okt/i, 'Oct')
                  .replace(/mai/i, 'May')
                  .replace(/maj/i, 'May')
                  .replace(/des/i, 'Dec');
                const ts = new Date(normalized).getTime();
                if (!isNaN(ts)) return ts;
              }
              return new Date(item.createdAt || 0).getTime();
            };
            return getSortableDate(b) - getSortableDate(a);
          });
          console.log('Articles loaded:', sorted.length);
          setArticles(sorted);
        } else {
          console.log('No API articles, using static data');
          setArticles(staticNewsArticles);
        }
      }
    } catch (e) {
      console.error("API offline, using static data");
      // Keep initial staticNewsArticles
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Separate useEffect for Deep Linking to ensure 'articles' state is ready
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    const articleId = params.get('article');
    const isAdmin = params.get('admin');
    const viewParam = params.get('view');
    const categoryParam = params.get('category');

    // Check both query param and pathname for admin access
    if (isAdmin !== null || pathname === '/admin') {
      setView('admin');
      // Clean URL by removing query param if present
      if (pathname !== '/admin') {
        window.history.replaceState({}, '', '/admin');
      }
    } else if (pathname.startsWith('/tag/')) {
      // Handle clean tag URLs like /tag/marine-heatwaves
      const slug = pathname.replace('/tag/', '').replace(/\/$/, '');
      setActiveTagSlug(slug);
      setView('tag-archive');
    } else if (pathname.startsWith('/category/')) {
      // Handle clean category URLs like /category/policy-economics
      const slug = pathname.replace('/category/', '');
      const category = slugToCategory(slug);
      setActiveCategory(category);
      setView('category');
    } else if (pathname === '/dashboard' || viewParam === 'dashboard') {
      setView('dashboard');
      if (pathname !== '/dashboard') {
        window.history.replaceState({}, '', '/dashboard');
      }
      if (pathname !== '/dashboard') {
        window.history.replaceState({}, '', '/dashboard');
      }
    } else if (viewParam === 'subscribe') {
      // Open modal instead of changing view
      setIsSubscribeModalOpen(true);
      // If we are just landing here, default to home view behind the modal
      if (view === 'home' || view === 'subscribe') {
        setView('home');
      }
    } else if (pathname === '/methodology' || viewParam === 'methodology') {
      // Methodology is part of the About page
      setView('about');
      if (pathname !== '/about') {
        window.history.replaceState({}, '', '/about');
      }
    } else if (pathname === '/about' || viewParam === 'about' || (window.location.hash === '#about' && view !== 'home')) {
      // Also catching #about if linking directly, though usually About is a section on Home or a separate page? 
      // In this app 'About' seems to be a separate view 'AboutPage'.
      setView('about');
      if (pathname !== '/about') {
        window.history.replaceState({}, '', '/about');
      }
    } else if (categoryParam && categoryParam !== 'All' && categoryParam !== 'Discover') {
      // Backward compatibility: redirect old query param URLs to new clean URLs
      const slug = categoryToSlug(categoryParam);
      window.history.replaceState({}, '', `/category/${slug}`);
      setActiveCategory(categoryParam);
      setView('category');
    } else if ((pathname.startsWith('/article/') || articleId) && articles.length > 0) {
      // Support both slug-based clean URLs and legacy ID-based URLs
      const identifier = articleId || pathname.replace('/article/', '');

      // Try to find by slug first, then fall back to ID
      let foundArticle = articles.find(a => a.slug === identifier);
      if (!foundArticle) {
        foundArticle = articles.find(a => a.id === identifier);
      }

      if (foundArticle) {
        setCurrentArticle(foundArticle);
        setView('article');

        // Normalize URL to use slug if available
        const preferredPath = `/article/${foundArticle.slug || foundArticle.id}`;
        if (pathname !== preferredPath) {
          window.history.replaceState({ view: 'article', articleId: foundArticle.id }, '', preferredPath);
        }
      }
    }
  }, [articles]);

  // Ref to store dashboard scroll position
  const dashboardScrollRef = React.useRef(0);

  // Handle Browser Back Button
  useEffect(() => {
    // Disable automatic browser scroll restoration to handle it manually
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        const viewState = event.state.view;

        switch (viewState) {
          case 'article':
            const found = articles.find(a => a.id === event.state.articleId);
            if (found) {
              setCurrentArticle(found);
              setView('article');
            }
            break;
          case 'category':
            setActiveCategory(event.state.category || 'All');
            setView('category');
            break;
          case 'tag-archive':
            if (event.state.tagSlug) {
              setActiveTagSlug(event.state.tagSlug);
            }
            setView('tag-archive');
            break;
          case 'sources':
            setView('sources');
            break;
          case 'dashboard':
            setView('dashboard');
            // Restore scroll position from session storage
            setTimeout(() => {
              const savedScroll = sessionStorage.getItem('dashboardScroll');
              if (savedScroll) {
                window.scrollTo(0, parseInt(savedScroll));
              }
            }, 100);
            break;
          case 'explanation':
            setView('explanation');
            window.scrollTo(0, 0);
            if (event.state.explanationData) {
              setExplanationData(event.state.explanationData);
            }
            break;
          case 'action-guide':
            setView('action-guide');
            break;
          case 'methodology':
            setView('methodology');
            break;
          case 'subscribe':
            setView('subscribe');
            break;
          case 'home':
          default:
            setView('home');
            setCurrentArticle(null);
            setSearchQuery('');
            break;
        }
      } else {
        // No state (often initial entry). Check URL to determine view.
        const path = window.location.pathname;
        const hash = window.location.hash;

        if (hash === '#explain') {
          setView('explanation');
          // Restore data from session if possible
          const savedData = sessionStorage.getItem('explanationData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Restore icon component based on title
            setExplanationData(restoreIcon(parsedData));
          }
        } else if (path === '/dashboard') {
          setView('dashboard');
          // Try to restore scroll even on null state if session has it
          setTimeout(() => {
            const savedScroll = sessionStorage.getItem('dashboardScroll');
            if (savedScroll) {
              window.scrollTo(0, parseInt(savedScroll));
            }
          }, 100);
        } else if (path === '/about') {
          setView('about');
        } else if (path === '/about') {
          setView('about');
        } else if (path === '/privacy') {
          setView('privacy');
        } else if (path === '/terms') {
          setView('terms');
        } else if (path === '/archives') {
          setView('archives');
        } else if (path.startsWith('/tag/')) {
          const slug = path.replace('/tag/', '').replace(/\/$/, '');
          setActiveTagSlug(slug);
          setView('tag-archive');
        } else {
          // Default to home
          setView('home');
          setCurrentArticle(null);
          setSearchQuery('');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // SEO: Update page title and canonical URL based on current view
  useEffect(() => {
    const baseUrl = 'https://planetarybrief.com';

    switch (view) {
      case 'home':
        updateMetaTags({
          title: 'Planetary Brief | Global Environmental Intelligence',
          description: 'Stay informed with expert environmental news, climate analysis, and sustainability insights from trusted sources.',
          canonicalUrl: baseUrl
        });
        break;
      case 'category':
        const categorySlug = categoryToSlug(activeCategory);
        updateMetaTags({
          title: `${activeCategory} News | Planetary Brief`,
          description: `Latest ${activeCategory.toLowerCase()} news and analysis from Planetary Brief.`,
          canonicalUrl: `${baseUrl}/category/${categorySlug}`
        });
        break;
      case 'dashboard':
        updateMetaTags({
          title: 'Earth Dashboard | Planetary Brief',
          description: 'Real-time planetary health metrics and environmental data visualization.',
          canonicalUrl: `${baseUrl}/dashboard`
        });
        break;
      case 'about':
        updateMetaTags({
          title: 'About | Planetary Brief',
          description: 'Learn about Planetary Brief\'s mission to translate complex scientific data into actionable intelligence.',
          canonicalUrl: `${baseUrl}/about`
        });
        break;

      case 'admin':
        // No SEO needed for admin pages
        document.title = 'Admin Dashboard | Planetary Brief';
        break;
      // Article view is handled in ArticleView component
    }
  }, [view, activeCategory]);

  const scrollToSection = (sectionId: Section) => {
    if (view !== 'home') {
      setView('home');
      setActiveCategory('All');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(sectionId);
        }
      }, 50);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
      }
    }
  };

  const handleArticleClick = (article: Article) => {
    setCurrentArticle(article);
    setView('article');
    window.scrollTo(0, 0);
    const urlPath = `/article/${article.slug || article.id}`;
    window.history.pushState({ view: 'article', articleId: article.id }, '', urlPath);
  };


  const handleBackToFeed = () => {
    window.history.back();
  };

  const handleBackFromMethodology = () => {
    window.history.back();
  };

  const handleShowAbout = () => {
    setView('about');
    window.scrollTo(0, 0);
    window.history.pushState({ view: 'about' }, '', '/about');
  };

  const handleShowDashboard = () => {
    setView('dashboard');
    window.scrollTo(0, 0);
    window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
  };



  // Helper to restore icon component lost in JSON serialization
  // Renamed to avoid conflict - should be removed later
  const restoreIcon_OLD = (data: any): ExplanationData => {
    const title = data.title || data.label; // Handle potential variations
    let IconComponent = Thermometer; // Default

    if (title === "Global Mean Temp" || title === "Permafrost Thaw") IconComponent = Thermometer;
    else if (title.includes("CO₂") || title.includes("Carbon")) IconComponent = CloudFog;
    else if (title.includes("Ice Sheet") || title.includes("West Antarctic")) IconComponent = MountainSnow;
    else if (title === "Sea Level Rise") IconComponent = Droplets;
    else if (title === "Ocean Acidity") IconComponent = Waves;
    else if (title === "Biodiversity") IconComponent = Bird;
    else if (title === "Forest Loss" || title.includes("Rainforest")) IconComponent = Leaf;
    else if (title.includes("Methane")) IconComponent = Flame;
    else if (title.includes("Atlantic Circulation") || title.includes("AMOC")) IconComponent = Wind;
    else if (title.includes("Limit") || title.includes("Warning")) IconComponent = AlertTriangle;

    return { ...data, icon: IconComponent };
  };

  const handleExplainData = (data: ExplanationData) => {
    // Explicitly update the CURRENT history entry to be a valid Dashboard checkpoint
    // This ensures that when the user clicks "Back", they return to this exact state
    if (view === 'dashboard') {
      window.history.replaceState({ view: 'dashboard' }, '', '/dashboard');
    }

    // Save scroll position
    sessionStorage.setItem('dashboardScroll', window.scrollY.toString());

    // Save explanation data to session so it persists across reloads/nav
    sessionStorage.setItem('explanationData', JSON.stringify(data));

    setExplanationData(data);
    setView('explanation');
    window.scrollTo(0, 0);
    // Use hash for navigation - explicit pushstate with hash
    window.location.hash = 'explain';
  };

  const handleCloseExplanation = () => {
    // Explicitly go to dashboard view
    setView('dashboard');
    // Replace URL to point to dashboard, effectively "closing" the modal in history
    window.history.replaceState({ view: 'dashboard' }, '', '/dashboard');

    // Restore scroll from session storage
    setTimeout(() => {
      const savedScroll = sessionStorage.getItem('dashboardScroll');
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll));
      }
    }, 100);
  };

  const handleBackToDashboard = () => {
    window.history.back();
  };

  const handleShowSubscribe = () => {
    setIsSubscribeModalOpen(true);
    // Optional: Update URL without navigation?
    // window.history.pushState({ view: 'home', subscribe: true }, '', '?view=subscribe');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (view !== 'home' && query.length > 0) {
      setView('home');
      setActiveCategory('All');
      setTimeout(() => {
        const newsSection = document.getElementById(Section.NEWS);
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (view === 'home' && query.length > 0) {
      const newsSection = document.getElementById(Section.NEWS);
      if (newsSection) {
        const rect = newsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          newsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    setSearchQuery('');
    setActiveCategory(category);
    if (category === 'All' || category === 'Discover') {
      setView('home');
      window.scrollTo(0, 0);
      window.history.pushState({ view: 'home', category }, '', '/');
    } else {
      setView('category');
      window.scrollTo(0, 0);
      const slug = categoryToSlug(category);
      window.history.pushState({ view: 'category', category }, '', `/category/${slug}`);
    }
  };

  const handleTagClick = (tagSlug: string) => {
    setActiveTagSlug(tagSlug);
    setView('tag-archive');
    window.scrollTo(0, 0);
    window.history.pushState({ view: 'tag-archive', tagSlug }, '', `/tag/${tagSlug}`);
  };

  if (view === 'admin') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-emerald-500" />
        </div>
      }>
        <AdminDashboard onBack={() => {
          setView('home');
          fetchArticles(); // Refresh data on return
          window.history.replaceState({}, '', window.location.pathname);
        }} />
      </Suspense>
    );
  }

  // Helper to get multiple articles by ID
  const getArticlesByIds = (ids: string[], allArticles: Article[]) => {
    return ids.map(id => allArticles.find(a => a.id === id)).filter(Boolean) as Article[];
  };

  const getHeroArticle = () => {
    // 1. Priority: Dynamic Global Hero (CMS)
    const featuredCandidates = articles.filter(a => a.isFeaturedDiscover);
    featuredCandidates.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

    if (featuredCandidates.length > 0) {
      return featuredCandidates[0];
    }

    // 2. Fallback: Config Hardcoded Hero
    const configHero = articles.find(a => a.id === homepageConfig.hero.articleId);
    if (configHero) {
      // Apply overrides if they exist
      return {
        ...configHero,
        title: homepageConfig.hero.headlineOverride || configHero.title,
        excerpt: homepageConfig.hero.subheadingOverride || configHero.excerpt
      };
    }

    // 3. Fallback: Default
    return articles.find(a => a.id === 'gs-policy-2026') || featuredArticle;
  };

  const heroArticle = getHeroArticle();

  // Get content for sections
  // Get content for sections
  const policyArticles = articles
    .filter(a => a.articleType === 'Policy Brief' || a.articleType === 'Treaty Explainer')
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 4);

  const analysisArticles = articles
    .filter(a => a.featuredInDepth || a.articleType === 'In-Depth Analysis' || a.articleType === 'Technology Assessment')
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 4);

  return (
    <AudioProvider>
      <div className="min-h-screen bg-news-bg text-news-text font-sans">
        <Navigation
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onArticleSelect={handleArticleClick}
          onDashboardClick={handleShowDashboard}
          onSubscribeClick={handleShowSubscribe}
          onShowAbout={handleShowAbout}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
          newsArticles={articles}
          currentView={view} // Pass the current view state
          lastSyncTime={lastSyncTime}
        />

        <main>
          {view === 'home' && (
            <>
              <div className="container mx-auto px-4 flex flex-col items-center">
                {/* Vertical Line */}
                <div className="w-px h-6 md:h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent mb-4 md:mb-6 mt-6 md:mt-16"></div>

                <div className="text-center max-w-4xl pb-4 md:pb-8">
                  <p className="text-lg md:text-xl lg:text-2xl font-serif leading-relaxed text-zinc-300">
                    <span className="text-news-accent font-semibold">Planetary Brief</span> delivers data-driven environmental intelligence across climate systems, biodiversity, governance, and innovation. We translate institutional research into structured analysis.
                  </p>
                </div>
              </div>

              <Hero
                onReadFeatured={() => handleArticleClick(heroArticle)}
                onArticleClick={handleArticleClick}
                featuredArticleOverride={heroArticle}
              />

              <LatestPolicySection
                title={homepageConfig.policySection.title}
                articles={policyArticles}
                onArticleClick={handleArticleClick}
              />

              <DataSignalsSection
                signals={homepageConfig.dataSignals}
                onExplain={() => handleExplainData({
                  title: 'Methodology',
                  icon: null,
                  color: 'green',
                  detailedInfo: { definition: '', context: '', impact: '' }
                })} // Placeholder handler for now
                onTagClick={handleTagClick}
                onViewDashboard={handleShowDashboard}
              />

              <InDepthAnalysisSection
                title={homepageConfig.analysisSection.title}
                articles={analysisArticles}
                onArticleClick={handleArticleClick}
              />

              <TopicHubsSection
                title={homepageConfig.topicHubs.title}
                categories={homepageConfig.topicHubs.pillars}
                onCategoryClick={handleCategorySelect}
              />

              {/* Portfolio removed per strategic redesign */}
              {/* <Portfolio ... /> */}

              <div className="w-full bg-black py-12 border-t border-white/5">
                <div className="container mx-auto px-4">
                  <div className="flex justify-center">
                    <AdUnit
                      format="horizontal"
                      variant="transparent"
                      className="w-full h-32 md:h-48 bg-transparent"
                      slotId={ADS_CONFIG.SLOTS.HOME_FOOTER}
                    />
                  </div>
                </div>
              </div>

            </>
          )}

          {view === 'category' && (
            <CategoryFeed
              category={activeCategory}
              articles={articles} // Pass dynamic articles
              onArticleClick={handleArticleClick}
              onBack={() => handleCategorySelect('All')}
              onViewDashboard={handleShowDashboard}
              onCategorySelect={handleCategorySelect}
            />
          )}

          {view === 'article' && currentArticle && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <ArticleView
                article={currentArticle}
                onBack={handleBackToFeed}
                onArticleSelect={handleArticleClick}
                allArticles={articles}
                onShowAbout={handleShowAbout}
                onCategoryClick={handleCategorySelect}
                onTagClick={handleTagClick}
              />
            </Suspense>
          )}

          {view === 'about' && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <AboutPage onBack={handleBackToFeed} />
            </Suspense>
          )}

          {view === 'dashboard' && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <EarthDashboard
                onBack={handleBackToFeed}
                onExplain={handleExplainData}
                onSearch={handleSearch}
                onDataSync={setLastSyncTime}
                onTagClick={handleTagClick}
              />
            </Suspense>
          )}

          {view === 'explanation' && explanationData && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <DataExplanationView
                data={explanationData}
                onBack={handleCloseExplanation}
              />
            </Suspense>
          )}




          {view === 'privacy' && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <PrivacyPolicy
                onBack={() => handleCategorySelect('All')}
              />
            </Suspense>
          )}

          {view === 'terms' && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <TermsOfUse
                onBack={() => handleCategorySelect('All')}
              />
            </Suspense>
          )}

          {view === 'archives' && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <Archives
                articles={articles}
                onArticleClick={handleArticleClick}
                onBack={() => handleCategorySelect('All')}
              />
            </Suspense>
          )}


          {view === 'tag-archive' && activeTagSlug && (
            <Suspense fallback={
              <div className="min-h-screen bg-black pt-36 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
              </div>
            }>
              <TagArchive
                tagSlug={activeTagSlug}
                articles={articles}
                onArticleClick={handleArticleClick}
                onBack={handleBackToFeed}
                onCategoryClick={handleCategorySelect}
              />
            </Suspense>
          )}

          {/* Global Footer available on all pages */}
          <Footer
            onCategoryClick={handleCategorySelect}
            onShowAbout={handleShowAbout}
            onDashboardClick={handleShowDashboard}
            onSubscribeClick={handleShowSubscribe}
          />
        </main>

        <Suspense fallback={null}>
          <SubscribeModal
            isOpen={isSubscribeModalOpen}
            onClose={() => {
              setIsSubscribeModalOpen(false);
              // If URL had ?view=subscribe, maybe revert it?
              if (window.location.search.includes('view=subscribe')) {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
          />
        </Suspense>

        <AudioPlayer />
      </div>
    </AudioProvider>
  );
}

export default App;