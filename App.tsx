import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio'; // Acts as Home/Discover Feed
import CategoryFeed from './components/CategoryFeed'; // New Category Page
import PlanetaryStatus from './components/PlanetaryStatus';
import About from './components/About';
import Action from './components/Action';
import Contact from './components/Contact';
import ArticleView from './components/ArticleView';

import EarthDashboard from './components/EarthDashboard';
import DataExplanationView from './components/DataExplanationView';
import ActionDetailsView from './components/ActionDetailsView';
import AboutPage from './components/AboutPage';
import SubscribeModal from './components/SubscribeModal';
import AdminDashboard from './components/AdminDashboard';
import AudioPlayer from './components/AudioPlayer';
import { AudioProvider } from './contexts/AudioContext';
import { Section, Article, ExplanationData } from './types';
import { featuredArticle, newsArticles as staticNewsArticles } from './data/content';

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
    'climate-change': 'Climate Change',
    'energy': 'Energy',
    'pollution': 'Pollution',
    'policy-and-economics': 'Policy & Economics',
    'oceans': 'Oceans',
    'biodiversity': 'Biodiversity',
    'conservation': 'Conservation',
    'solutions': 'Solutions',
    'guides': 'Guides'
  };
  return categoryMap[slug] || slug;
};

function App() {
  // Search now includes all dynamic articles
  // Browser History Management: All view changes push state to history API,
  // allowing the browser back/forward buttons to work correctly across the entire site
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);
  const [view, setView] = useState<'home' | 'category' | 'article' | 'sources' | 'dashboard' | 'explanation' | 'action-guide' | 'about' | 'subscribe' | 'admin'>('home');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [explanationData, setExplanationData] = useState<ExplanationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Dynamic Articles State
  const [articles, setArticles] = useState<Article[]>(staticNewsArticles);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Define fetchArticles outside useEffect to be reusable
  const fetchArticles = async () => {
    try {
      const headers: HeadersInit = {};
      let url = '/api/articles';

      // Check for admin token to preview drafts
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        url += '?includeUnpublished=true';
      }

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
    } else if (pathname === '/guides' || viewParam === 'action') {
      setView('action-guide');
      if (pathname !== '/guides') {
        window.history.replaceState({}, '', '/guides');
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
      // Support both clean URL and legacy query param
      const idToFind = articleId || pathname.replace('/article/', '');
      const foundArticle = articles.find(a => a.id === idToFind);
      if (foundArticle) {
        setCurrentArticle(foundArticle);
        setView('article');
        // Normalize URL if needed
        if (pathname !== `/article/${foundArticle.id}`) {
          window.history.replaceState({ view: 'article', articleId: foundArticle.id }, '', `/article/${foundArticle.id}`);
        }
      }
    }
  }, [articles]);

  // Handle Browser Back Button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // ... existing popstate logic ...

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
          case 'sources':
            setView('sources');
            break;
          case 'dashboard':
            setView('dashboard');
            break;
          case 'explanation':
            setView('explanation');
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
        // No state means we're at the initial page (home)
        setView('home');
        setCurrentArticle(null);
        setSearchQuery('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

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
    window.history.pushState({ view: 'article', articleId: article.id }, '', `/article/${article.id}`);
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

  const handleShowActionGuide = () => {
    setView('action-guide');
    window.scrollTo(0, 0);
    window.history.pushState({ view: 'action-guide' }, '', '/guides');
  };

  const handleExplainData = (data: ExplanationData) => {
    setExplanationData(data);
    setView('explanation');
    window.history.pushState({ view: 'explanation', explanationData: data }, '', '');
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

  if (view === 'admin') {
    return <AdminDashboard onBack={() => {
      setView('home');
      fetchArticles(); // Refresh data on return
      window.history.replaceState({}, '', window.location.pathname);
    }} />;
  }

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
          onActionGuideClick={handleShowActionGuide}
          onSubscribeClick={handleShowSubscribe}
          onShowAbout={handleShowAbout}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
          newsArticles={articles}
          currentView={view} // Pass the current view state
        />

        <main>
          {view === 'home' && (
            <>
              <Hero
                onReadFeatured={() => {
                  // Feature Logic:
                  // 1. Find all 'isFeaturedDiscover' articles
                  const featuredCandidates = articles.filter(a => a.isFeaturedDiscover);
                  // 2. Sort by 'createdAt' (newest upload first)
                  featuredCandidates.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

                  // 3. Pick winner, or fallback to fixed ID, or fallback to static default
                  const featured = featuredCandidates[0] || articles.find(a => a.id === 'gs-policy-2026') || featuredArticle;
                  handleArticleClick(featured);
                }}
                onArticleClick={handleArticleClick}
                // Pass the featured discover article
                featuredArticleOverride={(() => {
                  const featuredCandidates = articles.filter(a => a.isFeaturedDiscover);
                  featuredCandidates.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
                  return featuredCandidates[0] || articles.find(a => a.id === 'gs-policy-2026');
                })()}
                articles={articles}
              />
              {/* Pass DYNAMIC articles to Portfolio */}
              <Portfolio
                articles={articles}
                onArticleClick={handleArticleClick}
                searchQuery={searchQuery}
              />
              <About
                onShowAbout={handleShowAbout}
              />

            </>
          )}

          {view === 'category' && (
            <CategoryFeed
              category={activeCategory}
              articles={articles} // Pass dynamic articles
              onArticleClick={handleArticleClick}
              onBack={() => handleCategorySelect('All')}
            />
          )}

          {view === 'article' && currentArticle && (
            <ArticleView
              article={currentArticle}
              onBack={handleBackToFeed}
              onArticleSelect={handleArticleClick}
              allArticles={articles} // Pass dynamic articles
              onShowAbout={handleShowAbout}
            />
          )}

          {view === 'about' && (
            <AboutPage onBack={handleBackToFeed} />
          )}

          {view === 'dashboard' && (
            <EarthDashboard
              onBack={handleBackToFeed}
              onExplain={handleExplainData}
              onSearch={handleSearch}
            />
          )}

          {view === 'explanation' && explanationData && (
            <DataExplanationView
              data={explanationData}
              onBack={handleBackToDashboard}
            />
          )}

          {view === 'action-guide' && (
            <ActionDetailsView
              onBack={handleBackToFeed}
              onSearch={handleSearch}
              articles={articles}
              onArticleClick={handleArticleClick}
            />
          )}



          {/* Global Footer available on all pages */}
          <Contact
            onShowAbout={handleShowAbout}
            onSubscribeClick={handleShowSubscribe}
          />
        </main>

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

        <AudioPlayer />
      </div>
    </AudioProvider>
  );
}

export default App;