import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, AlertTriangle, Thermometer, Wind, Droplets, MountainSnow, Activity, Globe, Factory, Zap, Car, Leaf, AlertOctagon, Info, CloudFog, Waves, Bird, Flame, TrendingUp, Send, Bot, Terminal, Sparkles, HelpCircle, FileText } from 'lucide-react';
import { generateEcoAnalysis } from '../services/geminiService';
import { fetchClimateData } from '../services/climateService';
import { ChatMessage, ExplanationData } from '../types';

interface EarthDashboardProps {
    onBack: () => void;
    onExplain: (data: ExplanationData) => void;
    onSearch: (query: string) => void;
    onDataSync?: (time: string) => void;
    onTagClick?: (tagSlug: string) => void;
}

// --- DATA CALCULATION ENGINE ---
// Base date for data calibration: Jan 1, 2025
const BASE_DATE = new Date('2025-01-01').getTime();
const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

// Helper to calculate current value based on linear growth trend
const getDynamicValue = (baseValue: number, annualRate: number, decimals: number = 2): string => {
    const now = Date.now();
    const weeksPassed = (now - BASE_DATE) / MS_PER_WEEK;
    const weeklyRate = annualRate / 52;
    const currentValue = baseValue + (weeksPassed * weeklyRate);

    // Add prefix sign for positive numbers if base had it, handle rounding
    const formatted = currentValue.toFixed(decimals);
    return annualRate > 0 && baseValue > 0 ? `+${formatted}` : formatted;
};

// Helper for countdowns
const getRemainingBudget = (baseBudget: number, annualBurnRate: number): { remaining: string, percentage: number } => {
    const now = Date.now();
    const yearsPassed = (now - BASE_DATE) / (1000 * 60 * 60 * 24 * 365.25);
    const burned = yearsPassed * annualBurnRate;
    const remaining = Math.max(0, baseBudget - burned);
    return {
        remaining: remaining.toFixed(1),
        percentage: (remaining / 400) * 100 // 400 is total baseline
    };
};

const EarthDashboard: React.FC<EarthDashboardProps> = ({ onBack, onExplain, onSearch, onDataSync, onTagClick }) => {
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);

    // Real-time Data State
    const [realData, setRealData] = useState<any>(null);
    const [syncTime, setSyncTime] = useState('Syncing...');

    useEffect(() => {
        const loadLiveBiosphere = async () => {
            try {
                const data = await fetchClimateData();
                setRealData(data);
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Local time)';
                setSyncTime(timeStr);
                if (onDataSync) onDataSync(timeStr);
            } catch (err) {
                console.error("Biosphere sync failed", err);
                setSyncTime("Offline (Using Projections)");
            }
        };

        loadLiveBiosphere();
        // Refresh every 5 minutes
        const interval = setInterval(loadLiveBiosphere, 300000);
        return () => clearInterval(interval);
    }, []);

    // AI Chat Logic
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello. I am the GreenShift AI Assistant. I can answer questions about climate data, sustainability practices, environmental policy, or the state of the planet. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const responseText = await generateEcoAnalysis(input);

        const aiMsg: ChatMessage = { role: 'model', text: responseText };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Dynamic Carbon Budget
    const budgetData = getRemainingBudget(120, 40); // 120Gt left in Jan 2025, burning 40Gt/yr
    const carbonBudget = {
        total: 400,
        used: (400 - parseFloat(budgetData.remaining)).toFixed(1),
        remaining: budgetData.remaining,
        burnRate: 40
    };

    // ── CLIMATE SYSTEM indicators ──
    const climateIndicators = [
        {
            label: "CO₂ Concentration", metricId: "metric-co2", tagSlug: "carbon-budget",
            value: realData?.co2 ? `${realData.co2.value} ppm` : getDynamicValue(424, 2.4, 1) + " ppm",
            trend: "Rising", trendDir: "up" as const, color: "text-gray-400",
            source: "Mauna Loa Observatory", context: "Annual increase: ~2.4 ppm"
        },
        {
            label: "Renewable Growth", metricId: "metric-renewable", tagSlug: "energy-transition",
            value: "+510 GW", trend: "Accelerating", trendDir: "up" as const, color: "text-emerald-500",
            source: "IRENA (2024)", context: "Record capacity added in 2024"
        },
        {
            label: "Fossil Fuel Production", metricId: "metric-fossil", tagSlug: "emissions-trends",
            value: "~100 Mb/d", trend: "Near Peak", trendDir: "up" as const, color: "text-orange-500",
            source: "IEA World Energy Outlook", context: "Oil output near all-time high"
        },
    ];

    // ── BIOSPHERE indicators ──
    const biosphereIndicators = [
        {
            label: "Deforestation Rate", metricId: "metric-deforestation", tagSlug: "deforestation",
            value: "3.7M ha/yr", trend: "High", trendDir: "up" as const, color: "text-emerald-500",
            source: "Global Forest Watch (2024)", context: "Primary rainforest loss"
        },
        {
            label: "Marine Heatwave Trend", metricId: "metric-marine-heatwave", tagSlug: "ocean-acidification",
            value: "+300%", trend: "Worsening", trendDir: "up" as const, color: "text-red-500",
            source: "NOAA Ocean Climate", context: "Frequency increase since 1980s"
        },
        {
            label: "Protected Area Coverage", metricId: "metric-protected-areas", tagSlug: "planetary-boundaries",
            value: "17.6%", trend: "Expanding", trendDir: "up" as const, color: "text-blue-500",
            source: "UNEP-WCMC (2024)", context: "Land area · 30% target by 2030"
        },
        {
            label: "Biodiversity Index", metricId: "metric-biodiversity", tagSlug: "planetary-boundaries",
            value: "-73% LPI", trend: "Critical", trendDir: "down" as const, color: "text-yellow-500",
            source: "WWF Living Planet (2024)", context: "Wildlife populations since 1970"
        },
    ];

    // ── GOVERNANCE indicators ──
    const governanceIndicators = [
        {
            label: "Carbon Pricing Coverage", metricId: "metric-carbon-pricing", tagSlug: "multilateral-negotiations",
            value: "23%", trend: "Expanding", trendDir: "up" as const, color: "text-emerald-500",
            source: "World Bank (2024)", context: "Global emissions under carbon price"
        },
        {
            label: "Climate Finance Flows", metricId: "metric-climate-finance", tagSlug: "multilateral-negotiations",
            value: "$1.3T", trend: "Growing", trendDir: "up" as const, color: "text-blue-500",
            source: "CPI Global Landscape (2024)", context: "Annual investment · $4.3T needed"
        },
        {
            label: "NDC Progress", metricId: "metric-ndc-progress", tagSlug: "multilateral-negotiations",
            value: "Insufficient", trend: "Lagging", trendDir: "down" as const, color: "text-orange-500",
            source: "UNFCCC NDC Synthesis (2024)", context: "On track for ~2.5°C by 2100"
        },
    ];

    const boundaries = [
        { name: 'Climate Change', status: 'High Risk', score: 90, color: 'bg-red-500' },
        { name: 'Biosphere Integrity', status: 'High Risk', score: 95, color: 'bg-red-500' },
        { name: 'Land System Change', status: 'High Risk', score: 85, color: 'bg-red-500' },
        { name: 'Freshwater Change', status: 'Increasing Risk', score: 65, color: 'bg-orange-500' },
        { name: 'Biogeochemical Flows', status: 'High Risk', score: 98, color: 'bg-red-500' },
        { name: 'Ocean Acidification', status: 'Increasing Risk', score: 55, color: 'bg-orange-500' },
        { name: 'Atmospheric Aerosol', status: 'Safe', score: 20, color: 'bg-emerald-500' },
        { name: 'Ozone Depletion', status: 'Safe', score: 10, color: 'bg-emerald-500' },
        { name: 'Novel Entities (Plastics)', status: 'High Risk', score: 100, color: 'bg-red-500' },
    ];

    const tippingPoints = [
        {
            name: "Amazon Rainforest Dieback",
            searchKey: "Amazon",
            risk: "Moderate",
            trend: "Worsening",
            desc: "Deforestation and drying are pushing the rainforest toward a savanna state, releasing stored carbon.",
            icon: Leaf,
            color: "text-orange-500",
            detailedInfo: {
                definition: "The point where the Amazon becomes too dry to sustain itself as a rainforest, transforming irreversibly into a dry savanna.",
                context: "The Amazon creates its own rain through transpiration. If too many trees are cut, this cycle breaks. Scientists estimate the tipping point is at 20-25% deforestation; we are currently at ~17%.",
                impact: "Would release massive amounts of carbon stored in trees, causing a spike in global temperatures and disrupting rainfall patterns as far away as the US Midwest."
            },
            history: [
                { year: '1990', value: 9 }, // Deforestation %
                { year: '2000', value: 12 },
                { year: '2010', value: 15 },
                { year: '2020', value: 17 },
                { year: '2026', value: 17.5 }
            ]
        },
        {
            name: "Atlantic Circulation (AMOC)",
            searchKey: "Gulf Stream",
            risk: "Low",
            trend: "Stable",
            desc: "Currents moving heat north are slowing. Collapse would drastically cool Europe and alter global rains.",
            icon: Wind,
            color: "text-yellow-500",
            detailedInfo: {
                definition: "The Atlantic Meridional Overturning Circulation (AMOC) is a system of ocean currents (including the Gulf Stream) that circulates heat across the globe.",
                context: "Freshwater from melting ice sheets is disrupting this flow. It has weakened by ~15% since 1950. A total collapse is unlikely this century but would be catastrophic.",
                impact: "If it stops, Europe would freeze, sea levels on the US East Coast would rise sharply, and monsoon systems in Africa and Asia would fail, causing mass famine."
            },
            history: [
                { year: '1950', value: 100 }, // Baseline strength
                { year: '1980', value: 95 },
                { year: '2000', value: 90 },
                { year: '2015', value: 87 },
                { year: '2026', value: 85 }
            ]
        },
        {
            name: "West Antarctic Ice Sheet",
            searchKey: "Antarctic",
            risk: "High",
            trend: "Critical",
            desc: "Instability in the Thwaites Glacier suggests irreversible retreat may have already begun.",
            icon: MountainSnow,
            color: "text-red-500",
            detailedInfo: {
                definition: "A massive ice sheet sitting on land below sea level. Because warm water can get underneath it, it is inherently unstable.",
                context: "The Thwaites Glacier (the 'Doomsday Glacier') acts as a cork holding back the rest of the ice sheet. It is fracturing and retreating rapidly.",
                impact: "Contains enough ice to raise global sea levels by over 3 meters (10 feet). Its collapse would reshape world geography over the coming centuries."
            },
            history: [
                { year: '1990', value: 0 }, // Relative instability index
                { year: '2000', value: 20 },
                { year: '2010', value: 50 },
                { year: '2020', value: 80 },
                { year: '2026', value: 92 }
            ]
        },
        {
            name: "Permafrost Thaw",
            searchKey: "Permafrost",
            risk: "High",
            trend: "Worsening",
            desc: "Thawing ground releases methane. Abrupt thaw events are increasing in Siberia and Canada.",
            icon: Thermometer,
            color: "text-red-500",
            detailedInfo: {
                definition: "The thawing of ground that has been frozen for thousands of years in the Arctic. This ground is full of ancient organic matter.",
                context: "As it thaws, microbes eat the organic matter and release CO2 and Methane. This generates heat, causing more thawing—a dangerous self-reinforcing cycle.",
                impact: "Could release more carbon than all human emissions to date, making it impossible to meet climate targets regardless of how much we cut fossil fuel use."
            },
            history: [
                { year: '1980', value: 0 }, // Cumulative thaw index
                { year: '1990', value: 10 },
                { year: '2000', value: 25 },
                { year: '2010', value: 50 },
                { year: '2020', value: 85 },
                { year: '2026', value: 110 }
            ]
        }
    ];

    const sectors = [
        { name: "Energy Use", val: 73.2, icon: Zap, color: "bg-yellow-500" },
        { name: "Agriculture & Land", val: 18.4, icon: Leaf, color: "bg-emerald-500" },
        { name: "Industry", val: 5.2, icon: Factory, color: "bg-gray-400" },
        { name: "Waste", val: 3.2, icon: AlertTriangle, color: "bg-orange-500" },
    ];

    // Reusable indicator card renderer
    const renderIndicatorCard = (ind: { label: string; metricId: string; tagSlug: string; value: string; trend: string; trendDir: string; color: string; source: string; context: string }) => (
        <button
            key={ind.metricId}
            data-metric-id={ind.metricId}
            onClick={() => onTagClick?.(ind.tagSlug)}
            className="bg-zinc-900/40 border border-white/10 rounded-xl p-4 md:p-5 text-left hover:border-white/20 transition-all group"
        >
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{ind.label}</p>
            <p className={`text-lg md:text-xl font-serif font-bold ${ind.color} mb-1`}>{ind.value}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${ind.trendDir === 'down' ? 'text-red-500' : ind.color}`}>{ind.trend}</p>
            <div className="h-px bg-white/5 w-full mb-2"></div>
            <p className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">{ind.context}</p>
            <p className="text-[10px] text-gray-700 mt-1">{ind.source}</p>
        </button>
    );

    return (
        <div className="bg-black min-h-screen text-white font-sans pt-40 pb-4 md:pt-28 md:pb-8 animate-fade-in relative">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-10"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="container mx-auto px-5 md:px-12 relative z-10 pt-4 pb-4 md:pt-6 md:pb-8">

                {/* ════════════════════════════════════════════ */}
                {/* GROUP 1: CLIMATE SYSTEM                      */}
                {/* ════════════════════════════════════════════ */}

                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white">Climate System</h3>
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">6 Indicators</span>
                </div>

                {/* Carbon Budget Hero */}
                <div data-metric-id="metric-carbon-budget" className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 md:p-8 mb-4 md:mb-6 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-3">
                                <Activity className="text-news-accent" />
                                Remaining Carbon Budget
                            </h2>
                            <p className="text-xs md:text-sm text-gray-400 mt-1">Gigatons of CO₂ left before 1.5°C warming is locked in (50% probability).</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-3xl md:text-4xl font-bold font-mono text-white">{carbonBudget.remaining} Gt</span>
                            <span className="text-xs uppercase tracking-widest text-red-500 font-bold">~{Math.round(parseFloat(carbonBudget.remaining) / carbonBudget.burnRate)} Years Left at Current Rate</span>
                        </div>
                    </div>
                    <div className="h-6 bg-black/50 rounded-full overflow-hidden relative border border-white/5">
                        <div className="absolute inset-0 flex items-center px-4 z-10 justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-white/50">Used: {carbonBudget.used} Gt</span>
                            <span className="text-white">Total Budget: {carbonBudget.total} Gt</span>
                        </div>
                        <div className="h-full bg-gradient-to-r from-gray-600 via-gray-500 to-red-600 transition-all duration-1000" style={{ width: `${(parseFloat(carbonBudget.used) / carbonBudget.total) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-gray-600">Dataset: IPCC AR6 (2023 baseline)</span>
                        <button onClick={() => onTagClick?.('carbon-budget')} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors flex items-center gap-1">
                            <FileText size={10} />
                            View Analysis →
                        </button>
                    </div>
                </div>

                {/* Global Temperature Bar */}
                <div data-metric-id="metric-temperature-limit" className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm mb-4 md:mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="flex-shrink-0 flex items-center gap-4 w-full md:w-auto">
                            <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Global Temperature</h4>
                                <p className="text-gray-500 text-xs">Paris Agreement 1.5°C Threshold</p>
                            </div>
                        </div>
                        <div className="flex-grow w-full">
                            <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                <span>Pre-Industrial (0°C)</span>
                                <span className="text-white">Current (+1.48°C)</span>
                                <span className="text-red-500">Limit (+1.5°C)</span>
                            </div>
                            <div className="h-3 md:h-4 bg-white/10 rounded-full overflow-hidden relative">
                                <div className="absolute left-0 top-0 h-full w-[66%] bg-gradient-to-r from-emerald-500 to-yellow-500 opacity-20"></div>
                                <div className="absolute right-0 top-0 h-full w-[33%] bg-red-500/20"></div>
                                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 w-[98%] shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                                <div className="absolute left-[99%] top-0 h-full w-0.5 bg-white z-10 shadow-[0_0_10px_white]"></div>
                            </div>
                            <p className="text-right text-[10px] text-red-400 mt-2 font-bold uppercase tracking-widest animate-pulse">Threshold Imminent</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-gray-600">Source: NASA GISTEMP</span>
                        <button onClick={() => onTagClick?.('global-temperature')} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors flex items-center gap-1">
                            <FileText size={10} />
                            View Analysis →
                        </button>
                    </div>
                </div>

                {/* Climate System indicator cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                    {climateIndicators.map(renderIndicatorCard)}
                </div>

                {/* Emissions by Sector */}
                <div data-metric-id="metric-emissions-sector" className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm mb-16 md:mb-20">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-6">Emissions by Sector</h3>
                    <div className="space-y-4 md:space-y-6">
                        {sectors.map((s, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-2 rounded-full ${s.color} text-black`}>
                                        <s.icon size={16} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-white">{s.name}</span>
                                            <span className="font-mono text-gray-400">{s.val}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden pl-12">
                                    <div className={`h-full ${s.color}`} style={{ width: `${s.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-gray-600">Data: Climate Watch / WRI (2024 dataset)</span>
                        <button onClick={() => onTagClick?.('emissions-trends')} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors flex items-center gap-1">
                            <FileText size={10} />
                            View Analysis →
                        </button>
                    </div>
                </div>


                {/* ════════════════════════════════════════════ */}
                {/* GROUP 2: BIOSPHERE                           */}
                {/* ════════════════════════════════════════════ */}

                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white">Biosphere</h3>
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">4 Indicators</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20">
                    {biosphereIndicators.map(renderIndicatorCard)}
                </div>


                {/* ════════════════════════════════════════════ */}
                {/* GROUP 3: GOVERNANCE                          */}
                {/* ════════════════════════════════════════════ */}

                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white">Governance</h3>
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">3 Indicators</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-16 md:mb-20">
                    {governanceIndicators.map(renderIndicatorCard)}
                </div>


                {/* ════════════════════════════════════════════ */}
                {/* GROUP 4: SYSTEM RISK                         */}
                {/* ════════════════════════════════════════════ */}

                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white">System Risk</h3>
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">2 Indicators</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">

                    {/* Planetary Boundaries */}
                    <div data-metric-id="metric-planetary-boundaries" className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div>
                                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-2">Planetary Boundaries</h3>
                                <p className="text-xs text-gray-400 max-w-md">Based on the Stockholm Resilience Centre framework. We have breached 6 of 9 boundaries safe for human civilization.</p>
                            </div>
                            <Globe size={24} className="text-gray-500" />
                        </div>
                        <div className="grid grid-cols-1 gap-y-4 md:gap-y-5">
                            {boundaries.map((b, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{b.name}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${b.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-500' : b.status === 'High Risk' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>{b.status}</span>
                                    </div>
                                    <div className="h-1.5 bg-black rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/5">
                            <span className="text-[10px] text-gray-600">Source: Stockholm Resilience Centre (2023)</span>
                            <button onClick={() => onTagClick?.('planetary-boundaries')} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors flex items-center gap-1">
                                <FileText size={10} />
                                View Analysis →
                            </button>
                        </div>
                    </div>

                    {/* Tipping Points */}
                    <div data-metric-id="metric-tipping-points" className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-6 text-news-live">
                            <AlertOctagon size={20} />
                            <h3 className="text-lg md:text-xl font-serif font-bold text-white">Major Tipping Points</h3>
                        </div>
                        <div className="space-y-4 md:space-y-5">
                            {tippingPoints.map((tp, i) => (
                                <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-lg hover:border-white/20 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <tp.icon size={18} className={tp.color} />
                                        <div className="text-right">
                                            <span className={`block text-[10px] font-bold uppercase tracking-widest ${tp.color}`}>Risk: {tp.risk}</span>
                                            <span className="text-[10px] text-gray-500">Trend: {tp.trend}</span>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white mb-1 text-sm">{tp.name}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-3">{tp.desc}</p>
                                    <button
                                        onClick={() => onExplain({
                                            title: tp.name, value: `Risk: ${tp.risk}`, trend: tp.trend,
                                            icon: tp.icon, color: tp.color, detailedInfo: tp.detailedInfo, history: tp.history
                                        })}
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors"
                                    >
                                        <HelpCircle size={10} />
                                        Explain
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/5">
                            <span className="text-[10px] text-gray-600">Assessment year: 2024</span>
                            <button onClick={() => onTagClick?.('climate-tipping-points')} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors flex items-center gap-1">
                                <FileText size={10} />
                                View Analysis →
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default EarthDashboard;