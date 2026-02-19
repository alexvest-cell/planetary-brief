
export interface HubMetric {
    label: string;
    value: string;
    trend: string;
    trendDir: 'up' | 'down' | 'stable';
    color?: string;
}

export interface HubConfig {
    metrics: HubMetric[];
    summary: string;
}

export const HUB_METRICS: Record<string, HubConfig> = {
    'Climate & Energy Systems': {
        summary: "Tracking the global transition from fossil fuels to renewable energy systems.",
        metrics: [
            { label: "Atmospheric CO₂", value: "426 ppm", trend: "Rising", trendDir: "up", color: "text-red-500" },
            { label: "Global Temp Anomaly", value: "+1.48°C", trend: "Critical", trendDir: "up", color: "text-red-500" },
            { label: "Renewables Growth", value: "+510 GW", trend: "Accelerating", trendDir: "up", color: "text-emerald-500" },
            { label: "Fossil Fuel Demand", value: "Peak 2030", trend: "Plateauing", trendDir: "stable", color: "text-orange-500" }
        ]
    },
    'Biodiversity & Oceans': {
        summary: "Monitoring ecosystem integrity, species extinction risks, and ocean health.",
        metrics: [
            { label: "Deforestation Rate", value: "3.7M ha/yr", trend: "High Risk", trendDir: "up", color: "text-red-500" },
            { label: "Marine Heatwaves", value: "Frequency ↑", trend: "Worsening", trendDir: "up", color: "text-red-500" },
            { label: "Ocean Acidity", value: "pH 8.1", trend: "Acidifying", trendDir: "down", color: "text-orange-500" },
            { label: "Protected Areas", value: "17% Land", trend: "Expanding", trendDir: "up", color: "text-emerald-500" }
        ]
    },
    'Policy, Governance & Finance': {
        summary: "Analyzing the gap between climate pledges and real-world policy implementation.",
        metrics: [
            { label: "Carbon Pricing", value: "23% Coverage", trend: "Expanding", trendDir: "up", color: "text-emerald-500" },
            { label: "Climate Finance", value: "$1.3T / yr", trend: "Gap: $3T", trendDir: "down", color: "text-orange-500" },
            { label: "NDC Status", value: "Off Track", trend: "High Gap", trendDir: "down", color: "text-red-500" }
        ]
    },
    'Science & Data': {
        summary: "The latest empirical evidence from major climate research institutions.",
        metrics: [
            { label: "Major Datasets", value: "IPCC AR6", trend: "Updated", trendDir: "stable", color: "text-emerald-500" },
            { label: "Attribution Studies", value: "High Confidence", trend: "Expanding", trendDir: "up", color: "text-emerald-500" },
            { label: "Observational Gaps", value: "Global South", trend: "Persisting", trendDir: "stable", color: "text-orange-500" }
        ]
    },
    'Technology & Innovation': {
        summary: "Tracking the deployment speed and cost curves of critical climate technologies.",
        metrics: [
            { label: "Clean Tech Deployment", value: "Exponential", trend: "On Track", trendDir: "up", color: "text-emerald-500" },
            { label: "Battery Costs", value: "-80% (10yr)", trend: "Falling", trendDir: "down", color: "text-emerald-500" },
            { label: "Carbon Capture", value: "45 Mt", trend: "Lagging", trendDir: "down", color: "text-red-500" }
        ]
    },
    'Planetary Health & Society': {
        summary: "Examining the human intersection with environmental change and pollution.",
        metrics: [
            { label: "Air Pollution", value: "99% Exposed", trend: "Critical", trendDir: "up", color: "text-red-500" },
            { label: "Heat Mortality", value: "Rising", trend: "Worsening", trendDir: "up", color: "text-red-500" },
            { label: "Water Stress", value: "High", trend: "Increasing", trendDir: "up", color: "text-orange-500" }
        ]
    }
};
