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
        shortDescription: "Covers global decarbonization, energy transition policy, renewable energy, fossil fuel phaseout, carbon markets, and net zero strategy. Planetary Brief analyzes emissions trends, infrastructure deployment, and regulatory feasibility shaping climate action. This hub connects climate targets with energy systems, capital flows, and real-world implementation.",
        description: `The Climate & Energy Systems hub covers the full spectrum of global decarbonization policy, energy transition strategy, renewable infrastructure, fossil fuel phaseout timelines, carbon markets, and net zero commitments from governments and corporations. Planetary Brief provides structured analysis of emissions trajectories, electricity grid transformation, and the regulatory frameworks shaping the pace of climate action across major economies.

Energy systems are undergoing the fastest structural transformation in modern history. Solar and wind capacity is scaling at record rates, while legacy fossil fuel infrastructure continues to generate both political resistance and stranded asset risk. This hub tracks how national energy policies interact with international climate targets, examining where ambition and implementation diverge.

Coverage includes: IPCC-aligned emissions benchmarks, national energy transition roadmaps, carbon pricing mechanisms, Nationally Determined Contributions (NDCs), power sector investment flows, methane leak regulation, coal and gas phaseout timelines, and the geopolitics of critical mineral supply chains underpinning clean energy technology.

Planetary Brief connects upstream climate science with downstream policy and market dynamics. Each analysis draws on primary data from the International Energy Agency (IEA), UN Environment Programme (UNEP), BloombergNEF, and peer-reviewed research, ensuring coverage remains grounded in verifiable indicators rather than political statements. For policymakers, investors, researchers, and informed citizens tracking the trajectory of global decarbonization, this hub provides the data-backed intelligence required to understand what is happening — and why it matters.`,
        imageUrl: "https://placehold.co/1200x800?text=Climate+Energy",
        subCategories: ["Decarbonization", "Renewable Energy", "Extreme Weather", "Carbon Markets", "Methane"]
    },
    {
        id: "Planetary Health & Society",
        label: "Planetary Health & Society",
        shortDescription: "Analyzes how climate change, biodiversity loss, and pollution affect public health, food systems, migration, and economic stability. Coverage focuses on climate impacts, adaptation policy, and resilience planning. Planetary Brief examines how environmental disruption interacts with governance capacity and social infrastructure.",
        description: `The Planetary Health & Society hub analyzes the cascading effects of environmental degradation on human populations — from air and water quality crises to food system disruption, climate migration, urban heat stress, and the disproportionate burden placed on vulnerable communities. Planetary Brief examines how ecological breakdown interacts with governance capacity, economic systems, and social infrastructure.

Climate change is no longer a future risk. Record-breaking heatwaves, flooding, and drought are reshaping mortality patterns, agricultural productivity, and displacement statistics across every region of the world. This hub tracks how environmental pressures translate into measurable public health and social outcomes, and how institutions are — or are not — responding.

Coverage includes: air pollution and respiratory health data, water scarcity and sanitation access, climate-related displacement and migration, food insecurity and agricultural disruption, urban resilience planning, environmental justice and frontline community impacts, plastic pollution and chemical exposure, and the intersections of poverty, inequality, and ecological risk.

Planetary Brief draws on data from the World Health Organization (WHO), IPCC Working Group II, the Lancet Countdown on Health and Climate Change, UNICEF, and humanitarian monitoring systems to provide rigorous, evidence-based coverage. Each brief is designed to move beyond surface-level reporting, translating complex environmental health relationships into clear, actionable intelligence for policymakers, health professionals, researchers, and civil society organizations navigating an era of accelerating planetary disruption.`,
        imageUrl: "https://placehold.co/1200x800?text=Health+Society",
        subCategories: ["Air Quality", "Water Security", "Environmental Justice", "Urban Resilience", "Plastic Pollution"]
    },
    {
        id: "Policy, Governance & Finance",
        label: "Policy, Governance & Finance",
        shortDescription: "Examines climate agreements, environmental regulation, carbon pricing, ESG frameworks, and climate finance. Planetary Brief analyzes how governance systems and capital allocation influence emissions reduction and biodiversity outcomes. This hub assesses policy credibility, institutional capacity, and implementation gaps between pledges and delivery.",
        description: `The Policy, Governance & Finance hub examines the institutional frameworks, legal instruments, capital allocation decisions, and regulatory systems that determine how environmental targets are translated into enforceable action. Planetary Brief provides critical analysis of multilateral agreements, national legislation, corporate governance standards, ESG disclosure frameworks, and climate finance flows that shape the global environmental agenda.

Environmental ambition is only as durable as its governance architecture. This hub scrutinizes the gap between pledges and delivery — assessing the credibility of national climate plans, the enforceability of international agreements, the adequacy of public and private finance, and the structural barriers that separate policy design from measurable outcomes on the ground.

Coverage includes: UNFCCC negotiations and COP outcomes, the Paris Agreement compliance architecture, biodiversity finance under the Kunming-Montreal framework, carbon pricing mechanisms and emissions trading schemes, ESG reporting standards (ISSB, TCFD, CSRD), green bonds and sustainable finance taxonomy, multilateral development bank mandates, climate litigation trends, and the political economy of environmental regulation across major jurisdictions.

Planetary Brief draws on primary documentation from the United Nations, OECD, World Bank, Bank for International Settlements, and leading think tanks including the Stockholm Environment Institute and Climate Policy Initiative. Analysis is designed to support practitioners, institutional investors, regulators, legal professionals, and researchers who require rigorous, impartial intelligence on the governance and financial systems shaping planetary outcomes.`,
        imageUrl: "https://placehold.co/1200x800?text=Policy+Finance",
        subCategories: ["ESG & Reporting", "Global Treaties", "Green Finance", "Carbon Pricing", "Corporate Strategy"]
    },
    {
        id: "Biodiversity & Oceans",
        label: "Biodiversity & Oceans",
        shortDescription: "Focuses on biodiversity loss, ocean governance, deforestation, conservation policy, and ecosystem restoration. Coverage includes marine protection, protected areas, and biodiversity finance. Planetary Brief evaluates enforcement, funding, and ecological indicators to assess whether global commitments translate into measurable ecosystem recovery.",
        description: `The Biodiversity & Oceans hub tracks the state of the natural world — covering species extinction rates, ocean health indicators, deforestation trends, marine protected area coverage, and the policy and finance mechanisms designed to reverse ecosystem collapse. Planetary Brief provides evidence-based analysis of global conservation commitments and whether institutional responses are proportionate to the scale of biodiversity loss underway.

The biodiversity crisis is advancing in parallel with climate change, driven by habitat destruction, overexploitation, pollution, invasive species, and the cascading effects of a warming planet. Ocean systems — which absorb over 90% of excess heat and regulate carbon cycling — face compounding pressures from acidification, deoxygenation, plastic contamination, and industrial fishing. This hub examines how governance systems, funding mechanisms, and scientific monitoring are being mobilized in response.

Coverage includes: implementation of the Kunming-Montreal Global Biodiversity Framework and its 30x30 protected area targets, IPBES assessments of species and ecosystem status, ocean governance under UNCLOS and the High Seas Treaty, deforestation and land use change data, coral reef and marine ecosystem monitoring, rewilding and ecosystem restoration programs, biodiversity credits and nature-based finance, and the intersection of conservation and Indigenous land rights.

Analysis draws on data from the IUCN Red List, Global Forest Watch, IPBES, Copernicus Marine Service, and peer-reviewed conservation science, ensuring coverage is anchored in quantitative ecological indicators rather than narratives alone. This hub serves researchers, conservation practitioners, environmental lawyers, impact investors, and policymakers engaged with the biodiversity agenda.`,
        imageUrl: "https://placehold.co/1200x800?text=Biodiversity+Oceans",
        subCategories: ["Marine Protected Areas", "Species Conservation", "Forests & Land Use", "Blue Economy", "Rewilding"]
    },
    {
        id: "Science & Data",
        label: "Science & Data",
        shortDescription: "Translates climate science, emissions tracking, biodiversity research, and environmental datasets into structured analysis. Coverage includes IPCC findings, atmospheric trends, and measurable risk indicators. Planetary Brief connects scientific evidence with policy relevance, ensuring environmental governance discussions remain grounded in robust data.",
        description: `The Science & Data hub translates frontier climate science, environmental monitoring data, and methodological developments into structured analysis accessible to practitioners, policymakers, and informed audiences. Planetary Brief bridges the gap between peer-reviewed research and evidence-based decision-making, ensuring that the latest scientific findings inform — rather than lag behind — policy discourse.

Environmental governance increasingly depends on the quality, availability, and interpretation of planetary data. From satellite-derived deforestation alerts to atmospheric greenhouse gas concentrations, ocean temperature anomalies, and biodiversity monitoring frameworks, the methodologies and institutions producing this information are critical infrastructure for global environmental management. This hub examines both the data and the systems that generate it.

Coverage includes: IPCC Working Group findings and synthesis reports, atmospheric CO₂ and methane measurements from NOAA and Copernicus, global surface temperature records and attribution science, Arctic sea ice and ice sheet dynamics, ocean acidification and sea-level monitoring, biodiversity modeling and extinction risk assessments, remote sensing applications in land use and emissions tracking, and advances in Earth system and integrated assessment modeling.

Planetary Brief analyzes primary scientific literature, pre-publication data releases, and institutional reports from NASA, NOAA, ESA, the Met Office Hadley Centre, and leading research universities. Each brief is designed to communicate scientific complexity accurately without oversimplification — serving climate scientists, environmental analysts, research journalists, and technical policymakers who require precision alongside accessibility in their intelligence sources.`,
        imageUrl: "https://placehold.co/1200x800?text=Science+Data",
        subCategories: ["Climate Modeling", "Remote Sensing", "Methodology", "Academic Research", "Data Visualization"]
    },
    {
        id: "Technology & Innovation",
        label: "Technology & Innovation",
        shortDescription: "Covers renewable energy, energy storage, carbon capture, green hydrogen, and climate technology deployment. Planetary Brief evaluates scalability, cost curves, infrastructure constraints, and policy dependence shaping clean tech expansion. This hub assesses how technological innovation influences global decarbonization pathways.",
        description: `The Technology & Innovation hub evaluates the clean energy technologies, industrial decarbonization solutions, and digital systems that are reshaping the material economy of climate action. Planetary Brief provides rigorous assessment of scalability, cost trajectories, infrastructure requirements, and policy dependencies — separating commercially viable pathways from speculative proposals in the rapidly evolving landscape of environmental technology.

Technology is a necessary but insufficient component of the climate response. The speed at which solar, battery storage, electrolytic hydrogen, direct air capture, and sustainable materials technologies can be deployed at scale is constrained by supply chains, grid infrastructure, capital availability, regulatory environments, and skills capacity. This hub tracks those dynamics with precision, examining where progress is genuine and where announced commitments exceed delivery.

Coverage includes: solar and wind energy cost curves and manufacturing scale, grid-scale battery storage and long-duration energy storage development, green and low-carbon hydrogen production pathways, carbon capture and storage (CCS) deployments, sustainable aviation fuel (SAF) and maritime decarbonization technology, electric vehicle supply chains and charging infrastructure, AgriTech and precision agriculture for emissions reduction, circular economy and industrial symbiosis applications, and the digital infrastructure enabling environmental monitoring and optimization.

Analysis draws on data from BloombergNEF, IEA Technology Reports, the Rocky Mountain Institute, MIT Energy Initiative, and industry disclosures, grounded in quantitative performance and cost benchmarks. The hub serves technology investors, infrastructure developers, industrial strategists, energy policymakers, and researchers who require credible, data-driven assessment of where clean technology stands — and where it is genuinely headed.`,
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
