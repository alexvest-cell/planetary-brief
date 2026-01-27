import React, { useEffect, useState, useRef } from 'react';
import { Article } from '../types';
import { generateSpeech } from '../services/geminiService';
import { ArrowLeft, ExternalLink, FileText, Volume2, StopCircle, Loader2, BookOpen, Globe, BarChart3, Database, ArrowRight, Info, ZoomIn, ShieldCheck } from 'lucide-react';
import AdUnit from './AdUnit';
import { ADS_CONFIG } from '../data/adsConfig';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onArticleSelect: (article: Article) => void;
  allArticles: Article[];
  onShowMethodology: () => void;
}

// Audio Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ArticleDataVisual = ({ article }: { article: Article }) => {
  if (!article.contextBox) return null;

  return (
    <div className="my-12 -mx-4 md:mx-0 bg-zinc-900/40 border-y md:border border-white/10 md:rounded-xl overflow-hidden relative p-6 md:p-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-news-accent font-bold uppercase tracking-widest text-[10px] mb-4">
          <BookOpen size={14} className="animate-pulse" />
          <span>Deep Dive Context</span>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight mb-4">
          {article.contextBox.title}
        </h3>
        <p className="text-gray-300 text-base leading-relaxed border-l-2 border-white/10 pl-4 md:pl-6">
          {article.contextBox.content}
        </p>

        {article.contextBox.source && (
          <div className="pt-4 border-t border-white/5 mt-6">
            <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-widest font-bold">
              <Database size={10} />
              Verified Data: <span className="text-gray-400">{article.contextBox.source}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Combined Footer Component
const ArticleFooter = ({ onShowMethodology }: { onShowMethodology: () => void }) => (
  <div className="bg-zinc-900/60 border border-white/10 rounded-lg p-5 md:p-8 my-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
    {/* Brand Block */}
    <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center font-serif font-bold text-emerald-500 text-base md:text-lg ring-1 ring-emerald-500/20 flex-shrink-0">
        PB
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-white text-xs md:text-sm uppercase tracking-wide">Planetary Brief</span>
        <button
          onClick={onShowMethodology}
          className="text-[10px] uppercase tracking-wider text-emerald-500 hover:text-white transition-colors flex items-center gap-1 mt-0.5 group"
        >
          Verified Intelligence <Info size={12} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>

    {/* Divider */}
    <div className="hidden md:block w-px h-10 bg-white/10"></div>

    {/* Integrity Text */}
    <div className="flex flex-col gap-1.5 flex-grow">
      <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-[9px] md:text-[10px]">
        <ShieldCheck size={12} className="text-emerald-500" />
        <span>Editorial Integrity</span>
      </div>
      <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed max-w-2xl">
        Synthesized from verified data sources including IPCC, NOAA, and legislative filings.
        <span className="hidden sm:inline"> Our mission is to translate complex scientific data into actionable intelligence.</span>
      </p>
    </div>
  </div>
);

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, onArticleSelect, allArticles, onShowMethodology }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => stopAudio();
  }, [article.id]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  // SEO Optimization
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | GreenShift`;

      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', article.seoDescription || article.excerpt || article.title);

      // Update Keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      if (article.keywords && article.keywords.length > 0) {
        metaKeywords.setAttribute('content', article.keywords.join(', '));
      } else {
        // Fallback to category/topic
        const cats = Array.isArray(article.category) ? article.category.join(', ') : article.category;
        metaKeywords.setAttribute('content', `${cats}, ${article.topic}, environment, greenshift`);
      }
    }
  }, [article]);

  const handleToggleAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsAudioLoading(true);

    const textToRead = `Title: ${article.title}. ${article.content.join(' ')}`;
    const base64Audio = await generateSpeech(textToRead);

    if (!base64Audio) {
      alert("Could not generate audio summary. Please try again.");
      setIsAudioLoading(false);
      return;
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      const audioBytes = decode(base64Audio);
      const alignedBytes = new Uint8Array(audioBytes);
      const audioBuffer = await decodeAudioData(alignedBytes, audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      source.onended = () => {
        setIsPlaying(false);
        stopAudio();
      };

      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio playback error", e);
      alert("Error playing audio.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  // We use the pre-calculated random read time to ensure it adheres to the 3-6 minute requirement
  // independent of the generated content length.
  const readTime = article.originalReadTime || "5 min read";

  // Increased slice to 4 to balance the 2-col grid on mobile (2x2) and 4-col on desktop
  const relatedArticles = allArticles
    .filter(a => {
      if (a.id === article.id) return false;

      const currentCats = Array.isArray(article.category) ? article.category : [article.category];
      const targetCats = Array.isArray(a.category) ? a.category : (typeof a.category === 'string' ? [a.category] : []);

      return currentCats.some(cat => targetCats.includes(cat));
    })
    .slice(0, 4);

  return (
    <div className="bg-zinc-950 min-h-screen animate-fade-in text-white">
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div className="h-full bg-news-accent w-full animate-[width_1s_ease-out]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 pt-44 md:pt-32 pb-24 max-w-4xl">


        <header className="mb-8 md:mb-10 text-left">
          <div className="text-news-accent font-bold uppercase tracking-widest text-xs mb-3">
            {Array.isArray(article.category) ? article.category.join(', ') : article.category}
          </div>


          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.05] mb-6 md:mb-8">
            {article.title}
          </h1>

          {/* Compact Header Metadata */}
          <div className="flex items-center justify-between border-y border-white/10 py-4 my-6">
            <div className="flex items-center gap-4 text-xs uppercase tracking-wider font-bold text-gray-400">
              <span className="text-white">{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="flex items-center gap-1 text-gray-400"><FileText size={12} /> {readTime}</span>
            </div>

            <button
              onClick={handleToggleAudio}
              disabled={isAudioLoading}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group relative
                    ${isPlaying
                  ? 'border-news-live text-news-live bg-news-live/10'
                  : 'border-white/10 hover:border-news-accent text-white hover:text-news-accent'
                }`}
              title="Listen to Article"
            >
              {isAudioLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isPlaying ? (
                <>
                  <StopCircle size={16} className="fill-current" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-news-live rounded-full animate-pulse"></span>
                </>
              ) : (
                <Volume2 size={16} />
              )}
            </button>
          </div>
        </header>

        <figure className="mb-12 md:mb-16 -mx-4 md:-mx-12 lg:mx-0">
          <div className="relative aspect-[21/9] md:rounded-sm overflow-hidden">
            <img
              src={article.originalImageUrl || article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

        </figure>

        <div className="prose prose-lg md:prose-xl prose-invert max-w-none md:px-8 font-sans leading-relaxed text-gray-200">
          {(() => {
            let excerptRendered = false;
            let firstParagraphRendered = false;

            return article.content?.map((paragraph, index) => {
              const isSubheader = paragraph.length < 80 && !paragraph.endsWith('.') && !paragraph.endsWith('"');

              // Parse for // highlight // pattern
              const parseContent = (text: string) => {
                // Use [\s\S] to match newlines too, and handle potential spacing variations
                const parts = text.split(/\/\/([\s\S]*?)\/\//g);
                if (parts.length === 1) return text;

                return parts.map((part, i) => {
                  if (i % 2 === 1) { // Matched part
                    return (
                      <span key={i} className="block my-8 pl-4 md:pl-8 border-l-2 border-news-accent text-2xl md:text-3xl font-serif font-bold text-white italic leading-tight">
                        {part.replace(/^\/+|\/+$/g, '').trim()}
                      </span>
                    );
                  }
                  return part;
                });
              };

              let emittedElement;
              if (isSubheader) {
                emittedElement = <h3 key={index} className="text-2xl md:text-3xl font-serif font-bold text-white mt-12 mb-6 border-l-4 border-news-accent pl-4">{paragraph}</h3>
              } else {
                if (paragraph === article.excerpt) {
                  // Optional: still skip if exactly matches excerpt to avoid duplication if old data persists
                  // But new logic relies on // // tags.
                  // return null; 
                }

                const isFirst = !firstParagraphRendered;
                if (isFirst) firstParagraphRendered = true;

                emittedElement = (
                  <p key={index} className={`mb-8 ${isFirst ? 'first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px] first-letter:text-white' : ''}`}>
                    {parseContent(paragraph)}
                  </p>
                );
              }

              return (
                <React.Fragment key={index}>
                  {emittedElement}

                  {index === 1 && (
                    <ArticleDataVisual article={article} />
                  )}

                  {index === 4 && (
                    <AdUnit className="w-full h-64 my-12" format="rectangle" slotId={ADS_CONFIG.SLOTS.ARTICLE_IN_CONTENT} />
                  )}
                </React.Fragment>
              );
            });
          })()}
        </div>

        <div className="mt-16 mb-8">
          <AdUnit className="w-full h-32 md:h-48" format="horizontal" slotId={ADS_CONFIG.SLOTS.ARTICLE_FOOTER} />
        </div>

        {/* Combined Footer Component */}
        <ArticleFooter onShowMethodology={onShowMethodology} />

        {relatedArticles.length > 0 && (
          <div className="mt-12 mb-12 pt-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white">Related Intelligence</h3>
              <div className="h-px flex-grow bg-white/10 ml-8 hidden md:block"></div>
            </div>

            {/* Responsive Grid: 2 Cols on Mobile, 4 Cols on Desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedArticles.map((related) => (
                <div
                  key={related.id}
                  onClick={() => onArticleSelect(related)}
                  className="group cursor-pointer flex flex-col h-full bg-white/5 border border-white/5 rounded-lg overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={related.originalImageUrl || related.imageUrl}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <span className="text-[9px] md:text-[10px] text-news-accent font-bold uppercase tracking-widest mb-2 truncate">{related.category}</span>
                    <h4 className="text-sm md:text-base font-serif font-bold text-white leading-tight mb-3 group-hover:text-news-accent transition-colors line-clamp-3">
                      {related.title}
                    </h4>
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold">{related.date.split(',')[0]}</span>
                      <span className="hidden md:flex items-center gap-1 text-[10px] text-white font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default ArticleView;