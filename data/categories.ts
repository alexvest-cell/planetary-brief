export interface CategoryDefinition {
    id: string;
    label: string;
    description: string;
    shortDescription: string;
    imageUrl: string;
    subCategories: string[];
}

export const CATEGORIES: CategoryDefinition[] = [
    {
        id: "Climate & Energy Systems",
        label: "Climate & Energy Systems",
        shortDescription: "Climate science, energy transitions, and Earth system dynamics.",
        description: "Covers global decarbonization, energy transition policy, renewable energy, fossil fuel phaseout, carbon markets, and net zero strategy. Planetary Brief analyzes emissions trends, infrastructure deployment, and regulatory feasibility shaping climate action. This hub connects climate targets with energy systems, capital flows, and real-world implementation.",
        imageUrl: "https://placehold.co/1200x800?text=Climate+Energy",
        subCategories: ["Decarbonization", "Renewable Energy", "Extreme Weather", "Carbon Markets", "Methane"]
    },
    {
        id: "Planetary Health & Society",
        label: "Planetary Health & Society",
        shortDescription: "Pollution, health impacts, and societal dimensions of environmental change.",
        description: "Analyzes how climate change, biodiversity loss, and pollution affect public health, food systems, migration, and economic stability. Coverage focuses on climate impacts, adaptation policy, and resilience planning. Planetary Brief examines how environmental disruption interacts with governance capacity and social infrastructure.",
        imageUrl: "https://placehold.co/1200x800?text=Health+Society",
        subCategories: ["Air Quality", "Water Security", "Environmental Justice", "Urban Resilience", "Plastic Pollution"]
    },
    {
        id: "Policy, Governance & Finance",
        label: "Policy, Governance & Finance",
        shortDescription: "International agreements, regulations, and environmental economics.",
        description: "Examines climate agreements, environmental regulation, carbon pricing, ESG frameworks, and climate finance. Planetary Brief analyzes how governance systems and capital allocation influence emissions reduction and biodiversity outcomes. This hub assesses policy credibility, institutional capacity, and implementation gaps between pledges and delivery.",
        imageUrl: "https://placehold.co/1200x800?text=Policy+Finance",
        subCategories: ["ESG & Reporting", "Global Treaties", "Green Finance", "Carbon Pricing", "Corporate Strategy"]
    },
    {
        id: "Biodiversity & Oceans",
        label: "Biodiversity & Oceans",
        shortDescription: "Marine ecosystems, species conservation, and ocean governance.",
        description: "Focuses on biodiversity loss, ocean governance, deforestation, conservation policy, and ecosystem restoration. Coverage includes marine protection, protected areas, and biodiversity finance. Planetary Brief evaluates enforcement, funding, and ecological indicators to assess whether global commitments translate into measurable ecosystem recovery.",
        imageUrl: "https://placehold.co/1200x800?text=Biodiversity+Oceans",
        subCategories: ["Marine Protected Areas", "Species Conservation", "Forests & Land Use", "Blue Economy", "Rewilding"]
    },
    {
        id: "Science & Data",
        label: "Science & Data",
        shortDescription: "Latest research, methodologies, and data-driven environmental insights.",
        description: "Translates climate science, emissions tracking, biodiversity research, and environmental datasets into structured analysis. Coverage includes IPCC findings, atmospheric trends, and measurable risk indicators. Planetary Brief connects scientific evidence with policy relevance, ensuring environmental governance discussions remain grounded in robust data.",
        imageUrl: "https://placehold.co/1200x800?text=Science+Data",
        subCategories: ["Climate Modeling", "Remote Sensing", "Methodology", "Academic Research", "Data Visualization"]
    },
    {
        id: "Technology & Innovation",
        label: "Technology & Innovation",
        shortDescription: "Environmental solutions, clean technology, and sustainable innovation.",
        description: "Covers renewable energy, energy storage, carbon capture, green hydrogen, and climate technology deployment. Planetary Brief evaluates scalability, cost curves, infrastructure constraints, and policy dependence shaping clean tech expansion. This hub assesses how technological innovation influences global decarbonization pathways.",
        imageUrl: "https://placehold.co/1200x800?text=Tech+Innovation",
        subCategories: ["Carbon Capture", "Circular Economy", "AgriTech", "Clean Mobility", "Materials Science"]
    }
];

// New 5-Pillar Authority Structure (Now 6)
export const CATEGORY_IDS = [
    'All',
    'Climate & Energy Systems',
    'Planetary Health & Society',
    'Policy, Governance & Finance',
    'Biodiversity & Oceans',
    'Science & Data',
    'Technology & Innovation'
];

export const CATEGORY_DESCRIPTIONS = {
    'Climate & Energy Systems': 'Climate science, energy transitions, and Earth system dynamics',
    'Planetary Health & Society': 'Pollution, health impacts, and societal dimensions of environmental change',
    'Policy, Governance & Finance': 'International agreements, regulations, and environmental economics',
    'Biodiversity & Oceans': 'Marine ecosystems, species conservation, and ocean governance',
    'Science & Data': 'Latest research, methodologies, and data-driven environmental insights',
    'Technology & Innovation': 'Environmental solutions, clean technology, and sustainable innovation'
};

export const CATEGORY_COLORS = {
    'Climate & Energy Systems': '#ef4444',
    'Planetary Health & Society': '#8b5cf6',
    'Policy, Governance & Finance': '#3b82f6',
    'Biodiversity & Oceans': '#06b6d4',
    'Science & Data': '#f59e0b',
    'Technology & Innovation': '#10b981'
};

export const mapTopicToCategory = (topic: string): string => {
    // Direct match for main categories
    if (CATEGORY_IDS.includes(topic)) return topic;

    // Legacy Mapping
    if (topic === 'Climate Change') return 'Climate & Energy Systems';
    if (topic === 'Energy') return 'Climate & Energy Systems';
    if (topic === 'Pollution') return 'Planetary Health & Society';
    if (topic === 'Policy & Economics') return 'Policy, Governance & Finance';
    if (topic === 'Oceans') return 'Biodiversity & Oceans';
    if (topic === 'Biodiversity') return 'Biodiversity & Oceans';
    if (topic === 'Conservation') return 'Biodiversity & Oceans';
    if (topic === 'Solutions') return 'Technology & Innovation';

    // Other fallbacks
    if (topic === 'Forests') return 'Biodiversity & Oceans';
    if (topic === 'Food') return 'Technology & Innovation';
    if (topic === 'Cities') return 'Planetary Health & Society';
    if (topic === 'Justice') return 'Planetary Health & Society';
    if (topic === 'Economy') return 'Policy, Governance & Finance';
    if (topic === 'Technology') return 'Technology & Innovation';

    return 'Climate & Energy Systems';
};
