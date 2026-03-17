import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, ExternalLink, Download, Image as ImageIcon, Search } from 'lucide-react';
import { Article } from '../types';

interface SocialMediaManagerProps {
    articles: Article[];
}

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({ articles }) => {
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
    const [socialPosts, setSocialPosts] = useState<any | null>(null);
    const [socialLoading, setSocialLoading] = useState(false);
    const [activeSocialTab, setActiveSocialTab] = useState<Platform>('instagram');
    const [aiModel, setAiModel] = useState('gpt-4o');
    const [imageOffsetX, setImageOffsetX] = useState(0);
    const [imageOffsetY, setImageOffsetY] = useState(0);
    const [searchFilter, setSearchFilter] = useState('');
    const [sortType, setSortType] = useState('date');

    const getSortableDate = (item: any) => {
        if (item.date) {
            const normalized = item.date
                .replace(/okt/i, 'Oct').replace(/mai/i, 'May')
                .replace(/maj/i, 'May').replace(/des/i, 'Dec');
            const ts = new Date(normalized).getTime();
            if (!isNaN(ts)) return ts;
        }
        return new Date(item.createdAt || 0).getTime();
    };

    const filteredArticles = [...articles]
        .filter(a => !searchFilter || a.title.toLowerCase().includes(searchFilter.toLowerCase()))
        .sort((a: any, b: any) => {
            if (sortType === 'date') return getSortableDate(b) - getSortableDate(a);
            if (sortType === 'edited') return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
            if (sortType === 'name') return a.title.localeCompare(b.title);
            return 0;
        });

    const handleSelectArticle = (article: any) => {
        setSelectedArticle(article);
        setSocialPosts(null);
        setImageOffsetX(article.imageOffsetX || 0);
        setImageOffsetY(article.imageOffsetY || 0);
    };

    const handleSocialGenerate = async () => {
        if (!selectedArticle) {
            alert('Please select an article first.');
            return;
        }
        setSocialLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Title: ${selectedArticle.title}\nExcerpt: ${selectedArticle.excerpt}\nContent Sample: ${Array.isArray(selectedArticle.content)
                        ? selectedArticle.content.slice(0, 3).join('\n')
                        : (typeof selectedArticle.content === 'string' ? selectedArticle.content.substring(0, 1000) : '')}`,
                    type: 'social',
                    model: aiModel
                })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Generation failed');
            }
            const data = await res.json();
            setSocialPosts(data);
        } catch (err: any) {
            alert(`Failed to generate social posts: ${err.message}`);
        } finally {
            setSocialLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        const suffix = "Read on planetarybrief.com";
        let finalText = text.trim();
        if (!finalText.includes(suffix)) finalText = finalText + "\n\n" + suffix;
        navigator.clipboard.writeText(finalText);
        alert('Copied to clipboard!');
    };

    const handlePostIntent = (platform: Platform, text: string) => {
        const suffix = "Read on planetarybrief.com";
        let finalText = text.trim();
        if (!finalText.includes(suffix)) finalText = finalText + "\n\n" + suffix;
        const encodedText = encodeURIComponent(finalText);
        const articleUrl = `https://planetarybrief.com/article/${selectedArticle?.id || ''}`;
        const encodedUrl = encodeURIComponent(articleUrl);
        let url = '';
        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`; break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`; break;
            case 'instagram':
                alert('Instagram does not support direct posting via web. Text copied! Please open Instagram to post.');
                copyToClipboard(finalText); return;
            case 'linkedin':
                alert('LinkedIn does not support direct text posting via web intent. Text copied! Please open LinkedIn to post.');
                copyToClipboard(finalText);
                window.open('https://www.linkedin.com/feed/', '_blank'); return;
        }
        if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    const generateSocialImage = async (platform: Platform) => {
        if (!selectedArticle?.imageUrl || !selectedArticle?.title) {
            alert("No image or title available to generate graphic.");
            return;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 1080, height = 1350;
        if (platform === 'twitter' || platform === 'facebook' || platform === 'linkedin') {
            width = 1200; height = 630;
        }
        canvas.width = width; canvas.height = height;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedArticle.imageUrl;
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const offsetX = imageOffsetX * (canvas.width / 100);
        const offsetY = imageOffsetY * (canvas.height / 100);
        const x = (canvas.width / 2) - (img.width / 2) * scale + offsetX;
        const y = (canvas.height / 2) - (img.height / 2) * scale + offsetY;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.4, "rgba(0,0,0,0.5)");
        gradient.addColorStop(0.8, "rgba(0,0,0,0.9)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const padding = Math.floor(canvas.width * 0.06);
        const margin = padding;
        let titleScale = 0.08, subScaleFactor = 0.028, brandScale = 0.028, verticalLift = canvas.height * 0.055;
        if (platform === 'twitter' || platform === 'facebook' || platform === 'linkedin') {
            titleScale = 0.045; subScaleFactor = 0.018; brandScale = 0.018; verticalLift = canvas.height * 0.08;
        }

        let pY = canvas.height - margin - verticalLift;
        ctx.beginPath();
        ctx.moveTo(margin, pY);
        ctx.lineTo(margin + 100, pY);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = Math.max(6, canvas.width * 0.008);
        ctx.stroke();

        const subSize = Math.floor(canvas.width * subScaleFactor);
        const subText = selectedArticle.excerpt || (Array.isArray(selectedArticle.content) ? selectedArticle.content[0] : "") || "";
        const subWords = subText.split(' ');
        const maxSubWidth = canvas.width - (margin * 2.5);

        const calculateLines = (fontSize: number) => {
            ctx.font = `500 ${fontSize}px 'Inter', sans-serif`;
            const lines: string[] = [];
            let currentLine = '';
            for (let n = 0; n < subWords.length; n++) {
                const testLine = currentLine + subWords[n] + ' ';
                if (ctx.measureText(testLine).width > maxSubWidth && n > 0) {
                    lines.push(currentLine); currentLine = subWords[n] + ' ';
                } else { currentLine = testLine; }
            }
            lines.push(currentLine);
            return lines;
        };

        let finalSubSize = subSize;
        let subLines = calculateLines(finalSubSize);
        if (subLines.length > 4) { finalSubSize = Math.floor(subSize * 0.85); subLines = calculateLines(finalSubSize); }
        if (subLines.length > 5) { finalSubSize = Math.floor(subSize * 0.7); subLines = calculateLines(finalSubSize); }

        ctx.font = `500 ${finalSubSize}px 'Inter', sans-serif`;
        ctx.fillStyle = "#e5e7eb";
        ctx.shadowBlur = 10;
        pY -= (finalSubSize * 1.2);
        for (let i = subLines.length - 1; i >= 0; i--) {
            ctx.fillText(subLines[i], margin, pY);
            pY -= (finalSubSize * 1.3);
        }
        pY -= (canvas.width * 0.02);

        const titleSize = Math.floor(canvas.width * titleScale);
        ctx.font = `bold ${titleSize}px 'Playfair Display', serif`;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 20;

        let headlineText = selectedArticle.title;
        if (socialPosts && socialPosts[platform]?.headline) headlineText = socialPosts[platform].headline;

        const titleWords = headlineText.toUpperCase().split(' ');
        let titleLine = '';
        const titleLines: string[] = [];
        const maxTitleWidth = canvas.width - (margin * 2);
        for (let n = 0; n < titleWords.length; n++) {
            const testLine = titleLine + titleWords[n] + ' ';
            if (ctx.measureText(testLine).width > maxTitleWidth && n > 0) {
                titleLines.push(titleLine); titleLine = titleWords[n] + ' ';
            } else { titleLine = testLine; }
        }
        titleLines.push(titleLine);

        pY -= (titleSize * 0.3);
        for (let i = titleLines.length - 1; i >= 0; i--) {
            ctx.fillText(titleLines[i], margin, pY);
            pY -= (titleSize * 1.2);
        }

        ctx.save();
        const brandSize = Math.floor(canvas.width * brandScale);
        ctx.font = `bold ${brandSize}px 'Playfair Display', serif`;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        const briefMetrics = ctx.measureText("BRIEF.COM");
        const planetaryMetrics = ctx.measureText("PLANETARY");
        const bx = margin;
        const by = canvas.height - margin;
        ctx.fillStyle = "#10b981";
        ctx.fillText("PLANETARY", bx, by);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("BRIEF.COM", bx + planetaryMetrics.width, by);
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = `planetary-brief-${platform}-${Date.now()}.png`;
        a.href = dataUrl;
        a.click();
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        published: 'bg-green-500/20 text-green-400 border-green-500/30',
        scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* LEFT: Article List */}
            <div className="w-72 shrink-0 border-r border-white/5 bg-zinc-900/30 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Select Article</h3>
                    <div className="relative mb-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-700 focus:border-news-accent outline-none"
                            placeholder="Filter..."
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                        />
                    </div>
                    <select
                        className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-xs text-zinc-400 outline-none cursor-pointer"
                        value={sortType}
                        onChange={e => setSortType(e.target.value)}
                    >
                        <option value="date">Sort: Date (Newest)</option>
                        <option value="edited">Sort: Last Edited</option>
                        <option value="name">Sort: Name (A-Z)</option>
                    </select>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                    {filteredArticles.map((article: any) => {
                        const status = article.status || 'published';
                        const isSelected = selectedArticle?.id === article.id;
                        return (
                            <div
                                key={article.id}
                                onClick={() => handleSelectArticle(article)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all
                                    ${isSelected
                                        ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase ${statusColors[status] || statusColors.published}`}>
                                        {status}
                                    </span>
                                </div>
                                <h4 className={`font-bold text-xs leading-tight ${isSelected ? 'text-blue-400' : 'text-zinc-300'}`}>
                                    {article.title}
                                </h4>
                                <div className="text-[10px] text-zinc-600 font-mono mt-1">{article.date}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: Social Transformer */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {!selectedArticle ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <Sparkles size={32} className="text-zinc-700 mx-auto mb-4" />
                            <p className="text-sm text-zinc-500">Select an article from the list to generate social media content.</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Selected article info */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            {selectedArticle.imageUrl && (
                                <img src={selectedArticle.imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Selected Article</p>
                                <h2 className="text-sm font-bold text-white leading-tight truncate">{selectedArticle.title}</h2>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{selectedArticle.date} · {selectedArticle.originalReadTime}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles size={12} className="text-blue-400" /> Social Transformer
                                </h3>
                                <select
                                    value={aiModel}
                                    onChange={e => setAiModel(e.target.value)}
                                    className="bg-black/40 border border-blue-500/20 rounded px-2 py-1 text-[9px] text-blue-400 focus:outline-none focus:border-blue-500/50 uppercase tracking-tighter"
                                >
                                    <optgroup label="OpenAI" className="bg-zinc-900">
                                        <option value="gpt-4o">GPT-4o</option>
                                        <option value="gpt-4o-mini">GPT-4o-mini</option>
                                    </optgroup>
                                    <optgroup label="Google Gemini" className="bg-zinc-900">
                                        <option value="gemini-1.5-flash-latest">1.5 Flash</option>
                                        <option value="gemini-1.5-pro-latest">1.5 Pro</option>
                                        <option value="gemini-2.0-flash-exp">2.0 Flash</option>
                                    </optgroup>
                                </select>
                            </div>
                            <button
                                onClick={handleSocialGenerate}
                                disabled={socialLoading}
                                className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-2 transition-all"
                            >
                                {socialLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                {socialLoading ? 'Generating...' : 'Generate New Posts'}
                            </button>
                        </div>

                        {/* Image Offset Controls */}
                        <div className="flex gap-4 items-center bg-black/40 border border-blue-500/10 p-3 rounded-lg hover:border-blue-500/30 transition-all">
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] font-bold text-blue-500/60 uppercase flex justify-between items-center">
                                    <span>Position Horizontal</span>
                                    <span className="font-mono bg-blue-500/20 px-1 rounded text-blue-400">{imageOffsetX}%</span>
                                </label>
                                <input
                                    type="range" min="-50" max="50"
                                    value={imageOffsetX}
                                    onChange={e => setImageOffsetX(parseInt(e.target.value))}
                                    className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="w-px h-8 bg-white/5 mx-2" />
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] font-bold text-blue-500/60 uppercase flex justify-between items-center">
                                    <span>Position Vertical</span>
                                    <span className="font-mono bg-blue-500/20 px-1 rounded text-blue-400">{imageOffsetY}%</span>
                                </label>
                                <input
                                    type="range" min="-50" max="50"
                                    value={imageOffsetY}
                                    onChange={e => setImageOffsetY(parseInt(e.target.value))}
                                    className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        {socialPosts ? (
                            <div className="space-y-3">
                                <div className="flex border-b border-white/5">
                                    {(['instagram', 'facebook', 'twitter', 'linkedin'] as Platform[]).map(platform => (
                                        <button
                                            key={platform}
                                            onClick={() => setActiveSocialTab(platform)}
                                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase transition-colors border-b-2
                                                ${activeSocialTab === platform
                                                    ? 'border-blue-500 text-blue-400'
                                                    : 'border-transparent text-zinc-600 hover:text-white'}`}
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{activeSocialTab} Copy</span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => copyToClipboard(socialPosts[activeSocialTab]?.text || '')}
                                                className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"
                                                title="Copy Text"
                                            >
                                                <Copy size={12} />
                                            </button>
                                            <button
                                                onClick={() => handlePostIntent(activeSocialTab, socialPosts[activeSocialTab]?.text || '')}
                                                className="p-1 hover:bg-white/10 rounded text-blue-400 hover:text-blue-300 transition-colors"
                                                title="Post Now"
                                            >
                                                <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto bg-black/30 p-2 rounded mb-3">
                                        {socialPosts[activeSocialTab]?.text || "No content generated."}
                                    </p>
                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`border border-white/10 bg-white/5 flex items-center justify-center rounded-sm transition-all duration-300
                                                ${activeSocialTab === 'instagram' ? 'w-6 h-8' : 'w-10 h-5'}`}>
                                                <ImageIcon size={10} className="text-zinc-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-zinc-400">Targeted Graphic</span>
                                                <span className="text-[9px] text-zinc-600">Platform-optimised image</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => generateSocialImage(activeSocialTab)}
                                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] rounded flex items-center gap-1 transition-colors border border-white/10"
                                        >
                                            <Download size={10} /> Generate
                                        </button>
                                    </div>
                                    <div className="mt-2 text-[9px] text-zinc-600 font-mono truncate">
                                        Headline: <span className="text-zinc-500">{socialPosts[activeSocialTab]?.headline || selectedArticle.title}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
                                <Sparkles size={16} className="text-zinc-700 mx-auto mb-2" />
                                <p className="text-[10px] text-zinc-600">Click "Generate New Posts" to create optimised content for 4 platforms.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialMediaManager;
