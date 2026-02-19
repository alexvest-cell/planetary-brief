
import React, { useState, useEffect } from 'react';
import { Users, Send, FileText, Check, Copy, RefreshCw, BarChart2, Mail, Loader2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { getNewsletterStats, getSubscribers, generateDigestPreview, Subscriber, NewsletterStats } from '../utils/newsletterApi';
import { TAG_DICTIONARY } from '../data/tagDictionary';

interface NewsletterManagerProps {
    articles: Article[];
}

const NewsletterManager: React.FC<NewsletterManagerProps> = ({ articles }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'campaign'>('overview');
    const [stats, setStats] = useState<NewsletterStats | null>(null);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Campaign State
    const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [introText, setIntroText] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Initial Load
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNewsletterStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load stats. Check API key configuration.');
        } finally {
            setLoading(false);
        }
    };

    const loadSubscribers = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getSubscribers(page);
            setSubscribers(data.subscribers || []); // Handle potentially odd API response structures
        } catch (err) {
            setError('Failed to load subscribers.');
        } finally {
            setLoading(false);
        }
    };

    // Tab Switch Handler
    useEffect(() => {
        if (activeTab === 'subscribers' && subscribers.length === 0) {
            loadSubscribers();
        }
    }, [activeTab]);

    // Campaign Logic
    const toggleArticleSelection = (id: string) => {
        if (selectedArticles.includes(id)) {
            setSelectedArticles(prev => prev.filter(aid => aid !== id));
        } else {
            if (selectedArticles.length >= 5) {
                alert('Maximum 5 articles recommended for digest.');
                return;
            }
            setSelectedArticles(prev => [...prev, id]);
        }
    };

    const handleGenerateDigest = async () => {
        if (selectedArticles.length === 0) {
            alert('Please select at least one featured article.');
            return;
        }

        setLoading(true);
        try {
            // Sort selected articles by selection order or find them in props
            // Actually better to organize: 1st selected = featured, rest = supporting
            const selectedObjs = selectedArticles.map(id => articles.find(a => a.id === id)).filter(Boolean) as Article[];

            if (selectedObjs.length === 0) return;

            const featured = selectedObjs[0];
            const supporting = selectedObjs.slice(1);

            // Mock metric snapshot (in prod, fetch real data)
            const metricSnapshot = {
                label: 'Atmospheric CO2',
                value: '426.8 ppm',
                change: '+2.4 ppm',
                trend: 'Record High'
            };

            const payload = {
                intro: introText,
                featuredArticle: featured,
                supportingArticles: supporting,
                metricSnapshot
            };

            const { html } = await generateDigestPreview(payload);
            setGeneratedHtml(html);
        } catch (err) {
            alert('Failed to generate preview');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedHtml) {
            navigator.clipboard.writeText(generatedHtml);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-950">
                <div className="flex items-center gap-3">
                    <Mail className="text-emerald-500" size={24} />
                    <h1 className="text-xl font-serif font-bold tracking-tight">Newsletter Intelligence</h1>
                </div>
                <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'subscribers' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Subscribers
                    </button>
                    <button
                        onClick={() => setActiveTab('campaign')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'campaign' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Campaign Prep
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Total Subscribers</h3>
                                    <Users className="text-emerald-500" size={20} />
                                </div>
                                <div className="text-4xl font-mono text-white">
                                    {loading ? <Loader2 className="animate-spin" /> : stats?.total_subscribers?.toLocaleString() || '—'}
                                </div>
                                <div className="text-xs text-zinc-500 mt-2">
                                    Active audience
                                </div>
                            </div>

                            {/* Placeholder stats */}
                            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl opacity-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Avg Open Rate</h3>
                                    <BarChart2 className="text-blue-500" size={20} />
                                </div>
                                <div className="text-4xl font-mono text-white">42%</div>
                                <div className="text-xs text-zinc-500 mt-2">Last 30 days</div>
                            </div>

                            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl opacity-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Growth</h3>
                                    <RefreshCw className="text-amber-500" size={20} />
                                </div>
                                <div className="text-4xl font-mono text-white">+5.2%</div>
                                <div className="text-xs text-zinc-500 mt-2">Month over Month</div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-8 text-center">
                            <h2 className="text-2xl font-serif font-bold mb-4">Kit.com Integration Active</h2>
                            <p className="text-zinc-400 max-w-lg mx-auto mb-6">
                                Your subscriber base is synced with Kit. Use the Campaign Prep tab to generate weekly intelligence briefings.
                            </p>
                            <a
                                href="https://app.kit.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                            >
                                Go to Kit Dashboard <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                )}

                {/* SUBSCRIBERS TAB */}
                {activeTab === 'subscribers' && (
                    <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Subscriber List</h3>
                            <button onClick={() => loadSubscribers(1)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white">
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <table className="w-full text-left text-sm text-zinc-400">
                            <thead className="bg-white/5 text-zinc-200 font-bold uppercase text-xs">
                                <tr>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Created</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Tags</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading && subscribers.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></td></tr>
                                ) : subscribers.map(sub => (
                                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-white">{sub.email_address}</td>
                                        <td className="p-4">{new Date(sub.created_at).toLocaleDateString()}</td>
                                        <td className="p-4"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs uppercase font-bold">{sub.state}</span></td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {sub.tags?.map(t => (
                                                    <span key={t.id} className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px]">{t.name}</span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && subscribers.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No subscribers found or API error.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* CAMPAIGN PREP TAB */}
                {activeTab === 'campaign' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-in fade-in zoom-in-95 duration-300">
                        {/* Left: Builder */}
                        <div className="space-y-6 overflow-y-auto">
                            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl space-y-4">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <FileText size={18} className="text-emerald-500" />
                                    1. Editorial Intro
                                </h3>
                                <textarea
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-sm text-zinc-300 h-32 focus:border-emerald-500 outline-none"
                                    placeholder="Write a brief introduction for this week's digest..."
                                    value={introText}
                                    onChange={e => setIntroText(e.target.value)}
                                />
                            </div>

                            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <Check size={18} className="text-emerald-500" />
                                            2. Select Articles ({selectedArticles.length}/5)
                                        </h3>
                                        <span className="text-xs text-zinc-500">First selected will be Featured</span>
                                    </div>

                                    {/* Topic Filter */}
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-zinc-300 outline-none focus:border-emerald-500"
                                        value={selectedTopic || ''}
                                        onChange={(e) => setSelectedTopic(e.target.value || null)}
                                    >
                                        <option value="">All Topics</option>
                                        {Array.from(new Set(articles.flatMap(a => Array.isArray(a.category) ? a.category : [a.category]))).sort().map(topic => (
                                            <option key={topic} value={topic}>{topic}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {articles
                                        .filter(article => {
                                            if (!selectedTopic) return true;
                                            const cats = Array.isArray(article.category) ? article.category : [article.category];
                                            return cats.includes(selectedTopic);
                                        })
                                        .map(article => (
                                            <div
                                                key={article.id}
                                                onClick={() => toggleArticleSelection(article.id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all flex gap-3 ${selectedArticles.includes(article.id) ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-black/30 border-white/5 hover:bg-white/5'}`}
                                            >
                                                <div className={`w-4 h-4 mt-1 rounded border flex items-center justify-center ${selectedArticles.includes(article.id) ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-600'}`}>
                                                    {selectedArticles.includes(article.id) && <Check size={10} />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-zinc-200">{article.title}</div>
                                                    <div className="text-xs text-zinc-500 flex gap-2 mt-1">
                                                        <span>{new Date(article.date).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{Array.isArray(article.category) ? article.category[0] : article.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateDigest}
                                disabled={loading || selectedArticles.length === 0}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                Generate Digest Preview
                            </button>
                        </div>

                        {/* Right: Preview */}
                        <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full border border-white/10 relative">
                            <div className="bg-zinc-100 border-b p-3 flex justify-between items-center text-black">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Preview</span>
                                {generatedHtml && (
                                    <button
                                        onClick={copyToClipboard}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-zinc-800'}`}
                                    >
                                        {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                                        {copySuccess ? 'Copied!' : 'Copy HTML'}
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 bg-white overflow-hidden relative">
                                {generatedHtml ? (
                                    <iframe
                                        srcDoc={generatedHtml}
                                        className="w-full h-full border-0"
                                        title="Preview"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                                        <Mail size={48} className="mb-4 opacity-20" />
                                        <p>Select articles and generate preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default NewsletterManager;
