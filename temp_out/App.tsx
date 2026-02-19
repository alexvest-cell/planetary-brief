import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio'; // Acts as Home/Discover Feed
import CategoryFeed from './components/CategoryFeed'; // New Category Page
import PlanetaryStatus from './components/PlanetaryStatus';
import About from './components/About';
import Action from './components/Action';
import Contact from './components/Contact';
import ArticleView from './components/ArticleView';
import TrustedSources from './components/TrustedSources';
import EarthDashboard from './components/EarthDashboard';
import DataExplanationView from './components/DataExplanationView';
import ActionDetailsView from './components/ActionDetailsView';
import MethodologyView from './components/MethodologyView';
import SubscribeView from './components/SubscribeView';
import { Section, Article, ExplanationData } from './types';
import { featuredArticle, newsArticles } from './data/content';

function App() {
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);
  const [view, setView] = useState<'home' | 'category' | 'article' | 'sources' | 'dashboard' | 'explanation' | 'action-guide' | 'methodology' | 'subscribe'>('home');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [explanationData, setExplanationData] = useState<ExplanationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

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
  };

  const handleBackToFeed = () => {
    if (activeCategory !== 'All') {
        setView('category');
    } else {
        setView('home');
        // Scroll to the News section (Headlines)
        setTimeout(() => {
            const newsSection = document.getElementById(Section.NEWS);
            if (newsSection) {
                newsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
    setCurrentArticle(null);
  };

  const handleBackFromMethodology = () => {
    if (currentArticle) {
      setView('article');
    } else {
      setView('home');
    }
  };

  const handleShowSources = () => {
    setView('sources');
    window.scrollTo(0, 0);
  };

  const handleShowDashboard = () => {
    setView('dashboard');
    window.scrollTo(0, 0);
  };

  const handleExplainData = (data: ExplanationData) => {
    setExplanationData(data);
    setView('explanation');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setExplanationData(null);
  };

  const handleShowActionGuide = () => {
    setView('action-guide');
    window.scrollTo(0, 0);
  };

  const handleShowMethodology = () => {
    setView('methodology');
  };

  const handleShowSubscribe = () => {
    setView('subscribe');
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
      setSearchQuery(''); // Clear filters when navigating categories or discover
      setActiveCategory(category);
      if (category === 'All' || category === 'Discover') {
        setView('home');
        window.scrollTo(0,0);
      } else {
        setView('category');
        window.scrollTo(0,0);
      }
  };

  return (
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
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <main>
        {view === 'home' && (
          <>
            <Hero 
                onReadFeatured={() => handleArticleClick(featuredArticle)} 
                onArticleClick={handleArticleClick}
            />
            {/* Portfolio now acts as the "Discover" mixed feed */}
            <Portfolio 
              onArticleClick={handleArticleClick} 
              searchQuery={searchQuery}
            />
            <About 
              onShowMethodology={handleShowMethodology}
              onShowSources={handleShowSources}
            />
          </>
        )}

        {view === 'category' && (
            <CategoryFeed 
                category={activeCategory}
                onArticleClick={handleArticleClick}
                onBack={() => handleCategorySelect('All')}
            />
        )}
        
        {view === 'article' && currentArticle && (
            <ArticleView 
              article={currentArticle} 
              onBack={handleBackToFeed}
              onArticleSelect={handleArticleClick}
              allArticles={newsArticles}
              onShowMethodology={handleShowMethodology}
            />
        )}

        {view === 'sources' && (
            <TrustedSources onBack={handleBackToFeed} />
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
            />
        )}

        {view === 'methodology' && (
            <MethodologyView 
                onBack={handleBackFromMethodology}
            />
        )}

        {view === 'subscribe' && (
            <SubscribeView 
                onBack={handleBackToFeed}
            />
        )}

        {/* Global Footer available on all pages */}
        <Contact 
          onShowSources={handleShowSources} 
          onSubscribeClick={handleShowSubscribe}
        />
      </main>
    </div>
  );
}

export default App;