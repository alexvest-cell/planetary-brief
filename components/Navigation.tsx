import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Section, Article } from '../types';
import { Menu, X, Search, Bell, ChevronRight, Activity } from 'lucide-react';

interface NavigationProps {
  activeSection: Section;
  scrollToSection: (section: Section) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onArticleSelect: (article: Article) => void;
  onDashboardClick: () => void;
  onActionGuideClick: () => void;
  onSupportClick: () => void;
  onSubscribeClick: () => void;
  onShowAbout: () => void;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  newsArticles: Article[];
  currentView: string;
  lastSyncTime?: string;
}

import { CATEGORY_IDS } from '../data/categories';

const navCategories = CATEGORY_IDS;

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  scrollToSection,
  onSearch,
  searchQuery,
  onArticleSelect,
  onDashboardClick,
  onActionGuideClick,
  onSupportClick,
  onSubscribeClick,
  onShowAbout,
  activeCategory,
  onCategorySelect,
  newsArticles,
  currentView,
  lastSyncTime
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSearchValue(searchQuery);
    if (!searchQuery) {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Update dropdown position when suggestions change or search is open
  useEffect(() => {
    if (searchContainerRef.current && suggestions.length > 0) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(320, rect.width)
      });
    }
  }, [suggestions, isSearchOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    // Don't call onSearch here - only show dropdown suggestions

    if (val.trim().length > 1) {
      console.log('Searching for:', val);
      console.log('Total articles to search:', newsArticles.length);
      const filtered = newsArticles.filter(a => {
        const titleMatch = a.title.toLowerCase().includes(val.toLowerCase());
        const catMatch = Array.isArray(a.category)
          ? a.category.some(c => c.toLowerCase().includes(val.toLowerCase()))
          : (typeof a.category === 'string' && (a.category as string).toLowerCase().includes(val.toLowerCase()));

        return titleMatch || catMatch;
      }).slice(0, 10); // Increased from 5 to 10 to show more results
      console.log('Found results:', filtered.length, filtered.map(a => a.title));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (article: Article) => {
    onArticleSelect(article);
    setSearchValue('');
    setSuggestions([]);
    onSearch('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchValue('');
      setSuggestions([]);
      onSearch('');
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col font-serif overflow-visible">

      {/* Top Bar (Primary Nav) */}
      <div className={`w-full transition-all duration-300 overflow-visible ${isScrolled ? 'bg-black border-b border-white/10' : 'bg-black/90 backdrop-blur-md border-b border-white/5'}`}>
        <div className="container mx-auto px-4 md:px-8 py-3 md:py-0 md:h-16 flex flex-col md:flex-row gap-3 md:gap-0 overflow-visible">

          {/* Top Row on Mobile: Logo + Right Actions */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div
                className="cursor-pointer group"
                onClick={() => { onCategorySelect('All'); }}
              >
                <div className="font-serif text-2xl font-bold tracking-tighter uppercase transition-opacity hover:opacity-90">
                  <span className="text-news-accent">Planetary</span>
                  <span className="text-white">Brief</span>
                </div>
                <div className="text-gray-400 text-[10px] font-serif font-normal tracking-wide mt-0.5">
                  Environmental Intelligence, Explained.
                </div>
              </div>
            </div>

            {/* Mobile: Search & Menu (Moved here for row 1) */}
            <div className="flex md:hidden items-center gap-4">
              {/* Minified search trigger for mobile row 1 */}
              <button onClick={toggleSearch} className="text-gray-400 hover:text-white transition-colors">
                <Search size={18} />
              </button>
              <button
                className="text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Nav Buttons (Hidden on Mobile, Centered/Left on Desktop) */}
          <div className="hidden md:flex items-center gap-2 w-auto ml-12">
            <button
              onClick={onDashboardClick}
              className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${['dashboard', 'explanation'].includes(currentView) ? 'bg-news-accent/10 text-news-accent' : 'text-news-accent hover:bg-white/10'}`}
            >
              <Activity size={14} className={['dashboard', 'explanation'].includes(currentView) ? 'animate-pulse' : ''} />
              <span>PlanetDash</span>
            </button>
          </div>

          {/* Desktop Right Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4 ml-auto overflow-visible">
            {/* Expanded Search */}
            {isSearchOpen ? (
              <div ref={searchContainerRef} className="flex items-center bg-zinc-900 border border-news-accent/50 rounded-full px-3 py-1.5 animate-fade-in relative w-48 md:w-64">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-white text-base w-full placeholder:text-gray-500"
                  onKeyDown={(e) => e.key === 'Enter' && onSearch(searchValue)}
                />
                <button onClick={toggleSearch} className="text-news-accent hover:text-white">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={toggleSearch} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                <Search size={18} />
                <span className="text-xs font-bold uppercase tracking-widest hidden md:block group-hover:underline decoration-news-accent underline-offset-4">Search</span>
              </button>
            )}

            <button
              onClick={onSubscribeClick}
              className="px-4 py-1.5 rounded-md bg-news-accent text-black text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Only visible when search is open on mobile) */}
      <div className={`md:hidden ${isSearchOpen ? 'block' : 'hidden'} w-full bg-zinc-900 border-b border-white/10 p-4 animate-fade-in`}>
        <div className="flex items-center bg-black border border-white/20 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-white text-base w-full"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchValue)}
          />
          <button onClick={toggleSearch}>
            <X size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Secondary Bar (Categories or Action Menu) */}
      <div className={`relative w-full bg-black/80 backdrop-blur transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`}>

        <div className="container mx-auto px-4 md:px-8 h-full flex items-center overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-6 md:gap-8 min-w-max">
            {/* PlanetDash Submenu */}
            {['dashboard', 'explanation'].includes(currentView) ? (
              <div className="flex items-center gap-4 w-full animate-fade-in">
                <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-gray-400 text-[10px] font-mono uppercase tracking-wider">
                  System Snapshot
                </span>
                {lastSyncTime && (
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                    Last Updated: <span className="font-bold text-gray-400">{lastSyncTime.replace(' (Local time)', '')}</span>
                  </span>
                )}
                <span className="text-[10px] text-gray-600 font-mono ml-auto hidden md:flex items-center gap-1.5">
                  <Activity size={10} className="text-news-accent" />
                  Sources: NASA · ESA · NOAA · IPCC
                </span>
              </div>
            ) : (
              currentView !== 'action-guide' && currentView !== 'support' && navCategories.filter(cat => cat !== 'All').map(cat => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className={`text-[10px] md:text-xs font-serif font-bold uppercase tracking-widest transition-colors whitespace-nowrap relative py-1 ${activeCategory === cat ? 'text-news-accent' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-news-accent rounded-full z-10"></span>
                  )}
                </button>
              )))}

            {/* Show action submenu when Action is active */}
            {currentView === 'action-guide' && (
              <>
                <button
                  onClick={onActionGuideClick}
                  className="text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap relative py-1 text-news-accent"
                >
                  Guides
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-news-accent rounded-full"></span>
                </button>
                <button
                  onClick={onSupportClick}
                  className="text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap relative py-1 text-gray-400 hover:text-white"
                >
                  Support
                </button>
              </>
            )}
            {currentView === 'support' && (
              <>
                <button
                  onClick={onActionGuideClick}
                  className="text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap relative py-1 text-gray-400 hover:text-white"
                >
                  Guides
                </button>
                <button
                  onClick={onSupportClick}
                  className="text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap relative py-1 text-news-accent"
                >
                  Support
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-news-accent rounded-full z-10"></span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {
        isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black z-40 p-4 sm:p-6 md:px-8 animate-fade-in md:hidden border-b border-white/10 shadow-2xl pb-6">

            <div className="grid grid-cols-[1.3fr_1fr] gap-x-3 sm:gap-x-4">

              {/* Left Column: INTELLIGENCE BY SECTOR */}
              <div className="flex flex-col border-r border-white/10 pr-3 sm:pr-4">
                <h3 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-4">Intelligence By Sector</h3>
                <div className="flex flex-col gap-5 text-[11px] font-medium uppercase tracking-widest text-white">
                  {navCategories.filter(cat => cat !== 'All').map(cat => (
                    <button
                      key={cat}
                      onClick={() => { onCategorySelect(cat); setIsMobileMenuOpen(false); }}
                      className="text-left hover:text-news-accent transition-colors leading-snug"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: TOOLS & ABOUT */}
              <div className="flex flex-col pl-1 sm:pl-2">

                {/* SECTION: INTELLIGENCE TOOLS */}
                <div className="mb-8">
                  <h3 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-4">Intelligence Tools</h3>
                  <div className="flex flex-col gap-4 text-[11px] font-medium uppercase tracking-widest text-white">
                    <button onClick={() => { onDashboardClick(); setIsMobileMenuOpen(false); }} className="text-left flex items-start gap-2 hover:text-white transition-colors leading-snug">
                      <Activity size={12} className={['dashboard', 'explanation'].includes(currentView) ? 'text-news-accent animate-pulse mt-0.5 flex-shrink-0' : 'text-news-accent mt-0.5 flex-shrink-0'} />
                      <span>PlanetDash</span>
                    </button>
                  </div>
                </div>

                {/* SECTION: ABOUT */}
                <div className="mb-8">
                  <h3 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-4">About</h3>
                  <div className="flex flex-col gap-4 text-[10px] font-medium uppercase tracking-widest text-gray-400">
                    <button onClick={() => { onShowAbout(); setIsMobileMenuOpen(false); }} className="text-left hover:text-white transition-colors leading-snug">About Planetary Brief</button>
                    <button onClick={() => { onSubscribeClick(); setIsMobileMenuOpen(false); }} className="text-left hover:text-white transition-colors leading-snug">Newsletter</button>
                    <button onClick={() => { onSupportClick(); setIsMobileMenuOpen(false); }} className="text-left hover:text-white transition-colors leading-snug">Contact</button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )
      }

      {/* Search Dropdown Portal - renders outside navigation hierarchy */}
      {
        suggestions.length > 0 && typeof document !== 'undefined' && ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 9999
            }}
            className="bg-zinc-950 border border-news-accent/30 rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto"
          >
            {suggestions.map(article => (
              <div
                key={article.id}
                onClick={() => handleSuggestionClick(article)}
                className="p-3 border-b border-white/5 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors"
              >
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{article.title}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1 flex items-center gap-2">
                    <span>{(() => {
                      const cat = Array.isArray(article.category) ? article.category[0] : article.category;
                      return cat === 'Action' || cat === 'Act' ? 'Guides' : cat;
                    })()}</span>
                    <span className="text-gray-600">•</span>
                    <span>{article.date}</span>
                  </p>
                </div>
                <ChevronRight size={12} className="text-gray-600" />
              </div>
            ))}
          </div>,
          document.body
        )
      }
    </div >
  );
};

export default Navigation;