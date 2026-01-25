
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Loader2, Save, Search, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface AdminDashboardProps {
    onBack: () => void;
}


const CATEGORIES = ['Climate Change', 'Energy', 'Pollution', 'Policy & Economics', 'Oceans', 'Biodiversity', 'Conservation', 'Solutions', 'Act'];

const CATEGORY_COLORS: Record<string, string> = {
    'Climate Change': 'text-red-400',
    'Energy': 'text-yellow-400',
    'Pollution': 'text-gray-400',
    'Policy & Economics': 'text-blue-400',
    'Oceans': 'text-cyan-400',
    'Biodiversity': 'text-green-400',
    'Conservation': 'text-emerald-400',
    'Solutions': 'text-purple-400',
    'Act': 'text-news-accent'
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // AI Orchestrator State
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiModel, setAiModel] = useState('gemini-2.0-flash');
    const [minMinutes, setMinMinutes] = useState(5);
    const [maxMinutes, setMaxMinutes] = useState(10);

    // Import Tool State
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');

    // Social Media State
    const [socialPosts, setSocialPosts] = useState<{ twitter?: string, linkedin?: string, instagram?: string } | null>(null);
    const [socialLoading, setSocialLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Article>>({
        title: '',
        category: ['Climate Change'],
        topic: '',
        excerpt: '',
        content: [],
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        originalReadTime: '5 min read',
        imageUrl: '',
        contextBox: {
            title: '',
            content: '',
            source: ''
        }
    });

    // SEO State
    const [seoKeywords, setSeoKeywords] = useState('');

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            // Cache-busting to ensure we see latest edits
            const res = await fetch(`/api/articles?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                // Sort by updatedAt or createdAt desc (newest/latest edited on top)
                const sorted = data.sort((a: Article, b: Article) => {
                    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
                    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
                    return dateB - dateA;
                });
                setArticles(sorted);
            }
        } catch (err) {
            console.error("Failed to load articles", err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (err) {
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = () => {
        if (!importText.trim()) return;

        const parseTag = (tag: string) => {
            const regex = new RegExp(`<<<${tag}>>>([\\s\\S]*?)<<<END_${tag}>>>`, 'i');
            const match = importText.match(regex);
            return match ? match[1].trim() : '';
        };

        const newTitle = parseTag('HEADLINE');
        const newDate = parseTag('DISPLAY_DATE');
        const newReadTime = parseTag('READ_TIME');
        const newExcerpt = parseTag('TEASER');

        const genTitle = parseTag('GENERAL_TITLE');
        const genContent = parseTag('GENERAL_TEXT');
        const genSource = parseTag('GENERAL_SOURCES');

        const mainBodyRaw = parseTag('MAIN_BODY');
        const mainBody = mainBodyRaw ? mainBodyRaw.split(/\n\s*\n/).map(p => p.trim()).filter(p => p) : [];

        const keywordsRaw = parseTag('KEYWORDS');
        const metaDesc = parseTag('META');

        setFormData(prev => ({
            ...prev,
            title: newTitle || prev.title,
            date: newDate || prev.date,
            originalReadTime: newReadTime || prev.originalReadTime,
            excerpt: newExcerpt || prev.excerpt,
            content: mainBody.length > 0 ? mainBody : prev.content,
            seoDescription: metaDesc || prev.seoDescription,
            contextBox: {
                title: genTitle || prev.contextBox?.title || '',
                content: genContent || prev.contextBox?.content || '',
                source: genSource || prev.contextBox?.source || ''
            }
        }));

        if (keywordsRaw) {
            setSeoKeywords(keywordsRaw);
        }

        alert('Content imported successfully!');
        setShowImport(false);
        setImportText('');
    };

    const handleAiGenerate = async (type: 'title' | 'body' | 'full') => {
        const prompt = type === 'full' ? aiPrompt : (type === 'title'
            ? (formData.topic || formData.category)
            : (formData.title || formData.excerpt || formData.topic));

        if (!prompt) {
            alert('Please enter a prompt or topic.');
            return;
        }

        setAiLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    type,
                    model: aiModel,
                    category: formData.category,
                    topic: formData.topic,
                    minMinutes,
                    maxMinutes
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'AI Error');
            }

            const data = await res.json();
            if (type === 'full') {
                // Populate all fields from AI response
                if (data.title && data.content) {
                    setFormData(prev => ({
                        ...prev,
                        title: data.title,
                        excerpt: data.excerpt || data.content[0], // Use provided excerpt or first paragraph
                        content: data.content,
                        date: data.publicationDate || prev.date,
                        originalReadTime: data.readTime || `${Math.ceil(data.content.join(' ').split(/\s+/).length / 200)} min read`,
                        contextBox: data.contextBox || prev.contextBox
                    }));

                    // Set keywords if provided
                    if (data.keywords && Array.isArray(data.keywords)) {
                        setSeoKeywords(data.keywords.join(', '));
                    }
                }
            } else if (data.text) {
                if (type === 'title') {
                    setFormData(prev => ({ ...prev, title: data.text.replace(/\*\*/g, '').trim() }));
                } else {
                    setFormData(prev => ({ ...prev, content: data.text.split('\n\n') }));
                }
            }
        } catch (err: any) {
            console.error(err);
            // Alert the specific error from the server (e.g. Quota Exceeded)
            if (err.message && err.message !== 'AI Error') {
                alert(`AI Generation Failed: ${err.message}`);
            } else {
                alert('AI Generation failed. Check server logs.');
            }
        } finally {
            setAiLoading(false);
        }
    };



    const handleSocialGenerate = async () => {
        if (!formData.title && !formData.excerpt) {
            alert('Please draft some content (Title/Excerpt) first.');
            return;
        }

        setSocialLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Title: ${formData.title}\nExcerpt: ${formData.excerpt}\nContent Sample: ${Array.isArray(formData.content)
                        ? formData.content.slice(0, 3).join('\n')
                        : (typeof formData.content === 'string' ? formData.content.substring(0, 1000) : '')
                        }`,
                    type: 'social',
                    model: aiModel
                })
            });

            if (!res.ok) throw new Error('Generation failed');
            const data = await res.json();
            setSocialPosts(data);
        } catch (err) {
            alert('Failed to generate social posts');
        } finally {
            setSocialLoading(false);
        }
    };

    const generateSocialImage = async () => {
        if (!formData.imageUrl || !formData.title) {
            alert("No image or title available to generate graphic.");
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Instagram Portrait aspect ratio 4:5 (1080x1350)
        canvas.width = 1080;
        canvas.height = 1350;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = formData.imageUrl;

        // Wait for image load
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        // 1. Draw Image (Cover)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // 2. Dark Overlay Gradient for Text Readability (Stronger at bottom)
        const gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.4, "rgba(0,0,0,0.5)");
        gradient.addColorStop(0.8, "rgba(0,0,0,0.9)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Branding (Top Left)
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.font = "bold 50px 'Playfair Display', serif";

        ctx.fillStyle = "#10b981"; // news-accent green
        ctx.fillText("GREEN", 60, 90);

        const metrics = ctx.measureText("GREEN");
        const greenWidth = metrics.width;

        ctx.fillStyle = "#ffffff"; // White
        ctx.fillText("SHIFT", 60 + greenWidth, 90);
        ctx.restore();

        // 4. Content Block (Calculated from Bottom)
        const margin = 80;
        let pY = canvas.height - margin;

        // Date (Bottom)
        ctx.font = "bold 24px 'Inter', sans-serif";
        ctx.fillStyle = "#6b7280"; // Zinc-500
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        ctx.fillText(dateStr, margin, pY);
        pY -= 50;

        // Divider Line
        ctx.beginPath();
        ctx.moveTo(margin, pY);
        ctx.lineTo(margin + 100, pY);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 6;
        ctx.stroke();
        pY -= 40;

        // Excerpt (Optional)
        if (formData.excerpt) {
            ctx.font = "300 32px 'Inter', sans-serif";
            ctx.fillStyle = "#e4e4e7"; // Zinc-200

            // Use only the first complete sentence for punchiness
            const firstSentence = formData.excerpt.split(/[.!?]\s/)[0] + (formData.excerpt.match(/[.!?]/) ? formData.excerpt.match(/[.!?]/)[0] : '');
            const excerptWords = firstSentence.split(' ');
            let excerptLine = '';
            const excerptLines = [];
            const maxExcerptWidth = canvas.width - (margin * 2);

            for (let n = 0; n < excerptWords.length; n++) {
                const testLine = excerptLine + excerptWords[n] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxExcerptWidth && n > 0) {
                    excerptLines.push(excerptLine);
                    excerptLine = excerptWords[n] + ' ';
                } else {
                    excerptLine = testLine;
                }
            }
            excerptLines.push(excerptLine);

            // Limit excerpt to 2 lines
            let linesToShow = excerptLines;
            if (excerptLines.length > 2) {
                linesToShow = excerptLines.slice(0, 2);
                // Add ellipsis to the last visible line
                linesToShow[1] = linesToShow[1].substring(0, linesToShow[1].length - 3) + "...";
            }

            // Draw from bottom up
            for (let i = linesToShow.length - 1; i >= 0; i--) {
                ctx.fillText(linesToShow[i], margin, pY);
                pY -= 45; // Line height
            }
            pY -= 30; // Spacing before title
        }

        // Title (Big Serif)
        ctx.font = "bold 90px 'Playfair Display', serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 20;

        // Use AI Headline if available, else Title
        const headlineText = formData.title;
        const titleWords = headlineText.toUpperCase().split(' ');
        let titleLine = '';
        const titleLines = [];
        const maxTitleWidth = canvas.width - (margin * 2);

        for (let n = 0; n < titleWords.length; n++) {
            const testLine = titleLine + titleWords[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxTitleWidth && n > 0) {
                titleLines.push(titleLine);
                titleLine = titleWords[n] + ' ';
            } else {
                titleLine = testLine;
            }
        }
        titleLines.push(titleLine);

        // Draw Title from bottom up
        for (let i = titleLines.length - 1; i >= 0; i--) {
            ctx.fillText(titleLines[i], margin, pY);
            pY -= 100; // Title Line Height
        }

        // Trigger Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `greenshift-social-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const contentArray = Array.isArray(formData.content) ? formData.content : (formData.content as any).split('\n');

            const payload = {
                ...formData,
                content: contentArray,
                // Parse CSV string to array for backend
                keywords: seoKeywords.split(',').map(s => s.trim()).filter(Boolean),
                seoDescription: formData.seoDescription,
                // Ensure dates are set if missing
                createdAt: formData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // ... rest of submit



            const url = editingId
                ? `/api/articles/${editingId}`
                : '/api/articles';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Article saved successfully!');
                setEditingId(null);
                setFormData({
                    title: '',
                    category: ['Climate Change'],
                    topic: '',
                    excerpt: '',
                    content: [],
                    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    originalReadTime: '5 min read',
                    imageUrl: '',
                    contextBox: { title: '', content: '', source: '' }
                });
                loadArticles();
            } else {
                alert('Error saving article');
            }
        } catch (err) {
            console.error(err);
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to DELETE this article? This action cannot be undone.')) {
            setLoading(true);
            try {
                const res = await fetch(`/api/articles/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    alert('Article deleted.');
                    setEditingId(null);
                    setFormData({
                        title: '',
                        category: ['Climate Change'],
                        topic: '',
                        excerpt: '',
                        content: [],
                        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        originalReadTime: '5 min read',
                        imageUrl: '',
                        contextBox: { title: '', content: '', source: '' }
                    });
                    loadArticles();
                } else {
                    alert('Failed to delete.');
                }
            } catch (err) {
                alert('Network error during delete.');
            } finally {
                setLoading(false);
            }
        }
    };

    const startEdit = (article: Article) => {
        setEditingId(article.id);
        setFormData(article);
        setSeoKeywords(article.keywords ? article.keywords.join(', ') : '');
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-zinc-950 min-h-screen text-gray-100 font-sans selection:bg-news-accent/30 pt-20 pb-10 px-4 md:px-8 animate-fade-in">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full h-16 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 z-20 flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-news-accent shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        CMS Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <span>STATUS: {loading ? 'SAVING...' : 'READY'}</span>
                    <span>|</span>
                    <span>ENV: LOCALHOST</span>
                </div>
            </header>

            <div className="w-full max-w-[1800px] mx-auto h-full pt-6">
                <div className="grid grid-cols-12 gap-6 h-full">

                    {/* LEFT COLUMN: LIST (3/12 columns on large screens) -- MOVED TO RIGHT? No, usually Editor is Main. 
                        User had Editor Left, List Right. I will keep that.
                        Actually, standard CMS has sidebar left.
                        But code had Editor (col-span-2) and List (col-span-1).
                        I'll keep Editor as the MAIN focus (Left/Center) and List as sidebar (Right).
                    */}

                    {/* MAIN EDITOR AREA */}
                    <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">

                        {/* AI ORCHESTRATOR PANEL */}
                        <div className="bg-gradient-to-r from-emerald-950/20 to-zinc-900 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                                <Sparkles size={150} className="text-emerald-400 rotate-12" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={14} /> AI Assistant
                                        <span className="text-zinc-600">|</span>
                                        <button
                                            onClick={() => setShowImport(!showImport)}
                                            className="text-white/50 hover:text-white transition-colors text-xs flex items-center gap-1"
                                        >
                                            <Upload size={12} /> Import Text
                                        </button>
                                    </h2>

                                    {showImport && (
                                        <div className="bg-black/80 border border-zinc-700/50 p-4 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-xs font-bold text-zinc-400 uppercase">Paste Formatted Text</h3>
                                                <button onClick={() => setShowImport(false)} className="text-zinc-500 hover:text-white text-xs">Close</button>
                                            </div>
                                            <textarea
                                                className="w-full h-48 bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-3 text-xs font-mono text-zinc-300 focus:border-emerald-500/50 outline-none resize-none"
                                                placeholder={`<<<HEADLINE>>>\nTitle here\n<<<END_HEADLINE>>>\n\n<<<META>>>\nDescription here\n<<<END_META>>>\n...`}
                                                value={importText}
                                                onChange={(e) => setImportText(e.target.value)}
                                            />
                                            <div className="mt-2 flex justify-end">
                                                <button
                                                    onClick={handleImport}
                                                    className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                                                >
                                                    <Sparkles size={12} /> Parse & Populate
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <textarea
                                        className="w-full bg-black/40 border border-emerald-500/20 p-4 rounded-xl text-emerald-100 h-24 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all resize-none text-sm placeholder-emerald-800/50"
                                        placeholder="Command the AI agent (e.g. 'Write a breaking news piece on arctic drilling...')"
                                        value={aiPrompt}
                                        onChange={e => setAiPrompt(e.target.value)}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            className="bg-black/40 border border-emerald-500/20 p-2 rounded-lg text-xs text-emerald-400 outline-none hover:bg-emerald-500/10 cursor-pointer"
                                            value={aiModel}
                                            onChange={e => setAiModel(e.target.value)}
                                        >
                                            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast)</option>
                                            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Powerful)</option>
                                        </select>

                                        {/* Length Selectors */}
                                        <div className="flex items-center gap-2 bg-black/40 border border-emerald-500/20 p-2 rounded-lg">
                                            <span className="text-[10px] text-emerald-500/60 uppercase font-bold">Length:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max="30"
                                                value={minMinutes}
                                                onChange={e => setMinMinutes(parseInt(e.target.value) || 1)}
                                                className="w-12 bg-black/60 border border-emerald-500/20 rounded px-2 py-1 text-xs text-emerald-400 outline-none text-center"
                                            />
                                            <span className="text-emerald-500/40">-</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max="30"
                                                value={maxMinutes}
                                                onChange={e => setMaxMinutes(parseInt(e.target.value) || 1)}
                                                className="w-12 bg-black/60 border border-emerald-500/20 rounded px-2 py-1 text-xs text-emerald-400 outline-none text-center"
                                            />
                                            <span className="text-[10px] text-emerald-500/60">min</span>
                                        </div>

                                        <button
                                            onClick={() => handleAiGenerate('full')}
                                            disabled={aiLoading}
                                            className="ml-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-lg text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                            {aiLoading ? 'Generating...' : 'Generate Article'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EDITOR FORM */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                                    {editingId ? 'Edit Mode' : 'Drafting Mode'}
                                </h2>
                                <span className="text-xs font-mono text-zinc-600 bg-black/30 px-2 py-1 rounded">{editingId || 'NEW_ENTRY'}</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Row 1: Title & Meta */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-8 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Headline</label>
                                            <button type="button" onClick={() => handleAiGenerate('title')} className="text-[10px] text-news-accent hover:underline flex items-center gap-1"><Sparkles size={10} /> Suggest</button>
                                        </div>
                                        <input
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl p-4 text-xl md:text-2xl font-bold text-white placeholder-zinc-700 focus:border-news-accent focus:ring-1 focus:ring-news-accent/20 outline-none transition-all"
                                            placeholder="Article Headline..."
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Topic Tag</label>
                                        <input
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:border-news-accent outline-none"
                                            placeholder="e.g. Solar"
                                            value={formData.topic}
                                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Categories & Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Categories (Max 3)</label>
                                        <div className="flex flex-wrap gap-2 bg-zinc-950/30 p-4 rounded-xl border border-white/5 min-h-[100px]">
                                            {CATEGORIES.map(c => (
                                                <button
                                                    type="button"
                                                    key={c}
                                                    onClick={() => {
                                                        const current = Array.isArray(formData.category) ? formData.category : [];
                                                        const exists = current.includes(c);
                                                        let newCats = exists ? current.filter(cat => cat !== c) : [...current, c];
                                                        if (newCats.length > 3) newCats = newCats.slice(0, 3);
                                                        setFormData({ ...formData, category: newCats });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wide transition-all border
                                                        ${(Array.isArray(formData.category) ? formData.category.includes(c) : formData.category === c)
                                                            ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                                                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Display Date</label>
                                            <input
                                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:border-news-accent outline-none"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Read Time</label>
                                            <input
                                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:border-news-accent outline-none"
                                                value={formData.originalReadTime}
                                                onChange={e => setFormData({ ...formData, originalReadTime: e.target.value })}
                                            />
                                        </div>

                                        {/* FEATURED IMAGE */}
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cover Image</label>
                                            <div className="flex gap-4">
                                                <input
                                                    className="flex-1 bg-zinc-950/50 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:border-news-accent outline-none"
                                                    value={formData.imageUrl}
                                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                    placeholder="Valid Image URL..."
                                                />
                                                <label className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 flex items-center justify-center cursor-pointer transition-colors">
                                                    <Upload size={16} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                            {formData.imageUrl && (
                                                <div className="h-24 w-full rounded-xl overflow-hidden border border-white/5 relative mt-3">
                                                    <img src={formData.imageUrl} className="w-full h-full object-cover opacity-60" />
                                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono bg-black/20">PREVIEW</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Areas */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Teaser / Excerpt</label>
                                        <textarea
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl p-4 text-sm font-serif italic text-zinc-400 focus:border-news-accent outline-none h-24"
                                            value={formData.excerpt}
                                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                            placeholder="Hook the reader..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Main Body</label>
                                            <button type="button" onClick={() => handleAiGenerate('body')} className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"><Sparkles size={10} /> Auto-Complete Body</button>
                                        </div>
                                        <textarea
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl p-6 text-base font-serif leading-relaxed text-zinc-300 focus:border-news-accent outline-none min-h-[500px]"
                                            value={Array.isArray(formData.content) ? formData.content.join('\n\n') : formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value.split('\n\n') })}
                                            placeholder="Write your story here..."
                                        />
                                    </div>
                                </div>

                                {/* EXTRAS: Context & Visibility */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Deep Dive Context</h3>
                                        <input
                                            className="w-full bg-zinc-950/30 border border-white/10 rounded-lg p-3 text-xs text-white"
                                            placeholder="Context Title"
                                            value={formData.contextBox?.title || ''}
                                            onChange={e => setFormData({ ...formData, contextBox: { ...(formData.contextBox || {}), title: e.target.value } as any })}
                                        />
                                        <textarea
                                            className="w-full bg-zinc-950/30 border border-white/10 rounded-lg p-3 text-xs text-zinc-400 h-20"
                                            placeholder="Context details..."
                                            value={formData.contextBox?.content || ''}
                                            onChange={e => setFormData({ ...formData, contextBox: { ...(formData.contextBox || {}), content: e.target.value } as any })}
                                        />
                                        <input
                                            className="w-full bg-zinc-950/30 border border-white/10 rounded-lg p-3 text-xs text-zinc-500"
                                            placeholder="Source (e.g. NOAA)"
                                            value={formData.contextBox?.source || ''}
                                            onChange={e => setFormData({ ...formData, contextBox: { ...(formData.contextBox || {}), source: e.target.value } as any })}
                                        />
                                    </div>

                                    {/* SEO META */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Search Engine Optimization</h3>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Focus Keywords (Comma Separated)</label>
                                            <input
                                                className="w-full bg-zinc-950/30 border border-white/10 rounded-lg p-3 text-xs text-white"
                                                placeholder="e.g. climate change, emissions, carbon tax"
                                                value={seoKeywords}
                                                onChange={e => setSeoKeywords(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Meta Description</label>
                                            <textarea
                                                className="w-full bg-zinc-950/30 border border-white/10 rounded-lg p-3 text-xs text-zinc-400 h-24"
                                                placeholder="Brief summary for search results (max 160 chars recommended)..."
                                                value={formData.seoDescription || ''}
                                                onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Visibility & SEO</h3>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors flex-1">
                                                <input type="checkbox" className="accent-news-accent scale-110" checked={formData.isFeaturedDiscover || false} onChange={e => setFormData({ ...formData, isFeaturedDiscover: e.target.checked })} />
                                                <span className="text-xs text-zinc-400">Discover Feed</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors flex-1">
                                                <input type="checkbox" className="accent-news-accent scale-110" checked={formData.isFeaturedCategory || false} onChange={e => setFormData({ ...formData, isFeaturedCategory: e.target.checked })} />
                                                <span className="text-xs text-zinc-400">Category Hero</span>
                                            </label>
                                        </div>


                                    </div>

                                    {/* SOCIAL MEDIA TRANSFORMER */}
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <Sparkles size={12} className="text-blue-400" /> Social Media Transformer
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={handleSocialGenerate}
                                                disabled={socialLoading}
                                                className="text-[10px] bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                {socialLoading ? 'Generating...' : 'Generate Posts'}
                                            </button>
                                        </div>

                                        {socialPosts && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                                {/* X / Twitter */}
                                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">X / Twitter</span>
                                                        <a
                                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(socialPosts.twitter || '')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[10px] bg-white text-black px-2 py-1 rounded font-bold hover:bg-gray-200"
                                                        >
                                                            Post Now
                                                        </a>
                                                    </div>
                                                    <p className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">
                                                        {(socialPosts.twitter || (socialPosts as any).x) || <span className="text-zinc-600 italic">No content generated.</span>}
                                                    </p>
                                                </div>

                                                {/* LinkedIn */}
                                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">LinkedIn</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigator.clipboard.writeText(socialPosts.linkedin || '')}
                                                            className="text-[10px] bg-blue-700 text-white px-2 py-1 rounded font-bold hover:bg-blue-600"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed">{socialPosts.linkedin}</p>
                                                </div>


                                                {/* Instagram + Image Generation */}
                                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 col-span-1 md:col-span-2">
                                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Instagram / Visuals</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => navigator.clipboard.writeText(socialPosts.instagram || '')}
                                                                className="text-[10px] bg-pink-700 text-white px-2 py-1 rounded font-bold hover:bg-pink-600"
                                                            >
                                                                Copy Text
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={generateSocialImage}
                                                                className="text-[10px] bg-news-accent text-black px-2 py-1 rounded font-bold hover:bg-emerald-400 flex items-center gap-1"
                                                            >
                                                                <Upload size={10} /> Download Image
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="md:col-span-2">
                                                            <p className="text-xs text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed">
                                                                {socialPosts.instagram || <span className="text-zinc-600 italic">No content generated.</span>}
                                                            </p>
                                                        </div>
                                                        <div className="aspect-[4/5] bg-zinc-900 rounded-lg overflow-hidden relative group cursor-pointer" onClick={generateSocialImage}>
                                                            {formData.imageUrl ? (
                                                                <>
                                                                    <img src={formData.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <p className="text-white text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur">Preview Graphic</p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-zinc-600 text-[10px]">No Article Image</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-news-accent text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-emerald-400 hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] flex justify-center items-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {editingId ? 'Save Changes' : 'Publish Article'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIST SIDEBAR (3/12 columns on large screens) */}
                    <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full flex flex-col gap-4">
                        <div className="bg-zinc-900/80 backdrop-blur border border-white/10 p-4 rounded-xl flex-1 flex flex-col h-[calc(100vh-140px)] sticky top-24">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Library</h3>
                                <div className="text-[10px] text-zinc-600 font-mono">{articles.length} ITEMS</div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-2 mb-4">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                                    <input
                                        className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-700 focus:border-news-accent outline-none"
                                        placeholder="Filter..."
                                    />
                                </div>
                                <select
                                    className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-xs text-zinc-400 outline-none cursor-pointer"
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        const getSortableDate = (item: Article) => {
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

                                        const sorted = [...articles].sort((a, b) => {
                                            if (type === 'date') return getSortableDate(b) - getSortableDate(a);
                                            if (type === 'edited') return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
                                            if (type === 'name') return a.title.localeCompare(b.title);
                                            return 0;
                                        });
                                        setArticles(sorted);
                                    }}
                                >
                                    <option value="date">Sort: Date (Newest)</option>
                                    <option value="edited">Sort: Last Edited</option>
                                    <option value="name">Sort: Name (A-Z)</option>
                                </select>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            title: '', category: ['Climate Change'], topic: '', excerpt: '', content: [],
                                            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                                            originalReadTime: '5 min read', imageUrl: '', contextBox: { title: '', content: '', source: '' }
                                        });
                                    }}
                                    className="w-full py-3 mb-2 border border-dashed border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-news-accent/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Upload size={14} /> Create New
                                </button>

                                {articles.map(article => (
                                    <div
                                        key={article.id}
                                        onClick={() => startEdit(article)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all group relative text-left
                                            ${editingId === article.id
                                                ? 'bg-news-accent/10 border-news-accent/50 shadow-lg shadow-news-accent/5'
                                                : 'bg-transparent border-transparent hover:bg-white/5 border-b-white/5'}`}
                                    >
                                        <h4 className={`font-bold text-sm leading-tight mb-1.5 ${editingId === article.id ? 'text-news-accent' : 'text-zinc-300'}`}>
                                            {article.title}
                                        </h4>
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] text-zinc-600 font-mono space-y-0.5">
                                                <div>{article.date}</div>
                                                <div className="flex items-center gap-1">
                                                    {formData.updatedAt === article.updatedAt && editingId === article.id ? <span className="w-1.5 h-1.5 rounded-full bg-news-accent animate-pulse"></span> : null}
                                                    {article.updatedAt ? new Date(article.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {(Array.isArray(article.category) ? article.category.slice(0, 2) : [article.category]).map(c => (
                                                    <span key={c} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[c]?.replace('text-', 'bg-') || 'bg-gray-500'}`} title={c}></span>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Hover Delete */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(article.id); }}
                                            className="absolute top-2 right-2 p-1.5 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </div >
    );
};

export default AdminDashboard;
