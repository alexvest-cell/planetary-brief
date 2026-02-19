import React, { useState, useEffect, useRef } from 'react';
import { Section, Article } from '../types';
import { newsArticles } from '../data/content';
import { Menu, X, Search, Bell, ChevronRight, Activity } from 'lucide-react';

interface NavigationProps {
  activeSection: Section;
  scrollToSection: (section: Section) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onArticleSelect: (article: Article) => void;
  onDashboardClick: () => void;
  onActionGuideClick: () => void;
  onSubscribeClick: () => void;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

const navCategories = [
    "Climate Change",
    "Energy",
    "Pollution",
    "Policy & Economics",
    "Oceans",
    "Biodiversity",
    "Conservation",
    "Solutions"
];

const Navigation: React.FC<NavigationProps> = ({ 
    activeSection, 
    scrollToSection, 
    onSearch, 
    searchQuery,
    onArticleSelect, 
    onDashboardClick, 
    onActionGuideClick, 
    onSubscribeClick,
    activeCategory,
    onCategorySelect
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchValue(val);
      onSearch(val);

      if (val.trim().length > 1) {
          const filtered = newsArticles.filter(a =>
              a.title.toLowerCase().includes(val.toLowerCase()) ||
              a.category.toLowerCase().includes(val.toLowerCase())
          ).slice(0, 5);
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
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col font-sans">
      
      {/* Top Bar (Primary Nav) */}
      <div className={`w-full transition-colors duration-300 ${isScrolled ? 'bg-black border-b border-white/10' : 'bg-black/90 backdrop-blur-md border-b border-white/5'}`}>
          <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
              
              {/* Left: Brand & Modes */}
              <div className="flex items-center gap-8">
                  <div 
                    className="cursor-pointer flex items-center gap-2 group"
                    onClick={() => { onCategorySelect('All'); }}
                  >
                    <span className="font-serif text-2xl font-bold tracking-tighter uppercase transition-opacity hover:opacity-90">
                        <span className="text-news-accent">Green</span>
                        <span className="text-white">Shift</span>
                    </span>
                  </div>

                  <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
                      <button 
                        onClick={() => { onCategorySelect('All'); }}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-all ${activeCategory === 'All' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                        Discover
                      </button>
                      <button 
                        onClick={onActionGuideClick}
                        className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        Act
                      </button>
                      <button 
                        onClick={onDashboardClick}
                        className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-news-accent hover:bg-white/10 transition-all flex items-center gap-2 border-l border-white/10 ml-1 pl-4"
                      >
                        <Activity size={14} className="animate-pulse" />
                        Earth Dashboard
                      </button>
                  </div>
              </div>

              {/* Right: Search & Mobile Toggle */}
              <div className="flex items-center gap-4">
                  {/* Expanded Search */}
                  {isSearchOpen ? (
                      <div className="flex items-center bg-zinc-900 border border-news-accent/50 rounded-full px-3 py-1.5 animate-fade-in relative w-48 md:w-64">
                          <input 
                              ref={searchInputRef}
                              type="text" 
                              value={searchValue}
                              onChange={handleSearchChange}
                              placeholder="Search..."
                              className="bg-transparent border-none focus:outline-none text-white text-xs w-full placeholder:text-gray-500"
                          />
                          <button onClick={toggleSearch} className="text-news-accent hover:text-white">
                              <X size={14} />
                          </button>
                          
                          {/* Search Dropdown */}
                          {suggestions.length > 0 && (
                            <div className="absolute top-full right-0 w-[300px] mt-2 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
                                {suggestions.map(article => (
                                    <div 
                                        key={article.id}
                                        onClick={() => handleSuggestionClick(article)}
                                        className="p-3 border-b border-white/5 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors"
                                    >
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-xs font-bold text-white truncate">{article.title}</h4>
                                        </div>
                                        <ChevronRight size={12} className="text-gray-600" />
                                    </div>
                                ))}
                            </div>
                          )}
                      </div>
                  ) : (
                      <button onClick={toggleSearch} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                          <Search size={18} />
                          <span className="text-xs font-bold uppercase tracking-widest hidden md:block group-hover:underline decoration-news-accent underline-offset-4">Search</span>
                      </button>
                  )}

                  <button 
                     onClick={onSubscribeClick} 
                     className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                     <Bell size={18} />
                  </button>

                  <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
              </div>

          </div>
      </div>

      {/* Secondary Bar (Categories) */}
      <div className={`w-full bg-black/80 backdrop-blur border-b border-white/10 transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`}>
          <div className="container mx-auto px-4 md:px-8 h-full flex items-center overflow-x-auto hide-scrollbar">
               <div className="flex items-center gap-6 md:gap-8 min-w-max mx-auto md:mx-0">
                   {navCategories.map(cat => (
                       <button
                         key={cat}
                         onClick={() => onCategorySelect(cat)}
                         className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap relative py-1 ${
                             activeCategory === cat ? 'text-news-accent' : 'text-gray-400 hover:text-white'
                         }`}
                       >
                           {cat}
                           {activeCategory === cat && (
                               <span className="absolute bottom-0 left-0 w-full h-0.5 bg-news-accent rounded-full"></span>
                           )}
                       </button>
                   ))}
               </div>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-28 bg-black z-40 p-6 animate-fade-in md:hidden border-t border-white/10">
           <div className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest">
              <button onClick={() => { onCategorySelect('All'); setIsMobileMenuOpen(false); }} className="text-left text-white border-b border-white/10 pb-4">Home</button>
              <button onClick={() => { onActionGuideClick(); setIsMobileMenuOpen(false); }} className="text-left text-white border-b border-white/10 pb-4">Act Now</button>
              <button onClick={() => { onDashboardClick(); setIsMobileMenuOpen(false); }} className="text-left text-news-accent border-b border-white/10 pb-4 flex items-center gap-2">
                 Earth Dashboard <Activity size={16} className="animate-pulse" />
              </button>
              <button onClick={() => { onSubscribeClick(); setIsMobileMenuOpen(false); }} className="text-left text-white flex items-center gap-2">
                 Subscribe
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;