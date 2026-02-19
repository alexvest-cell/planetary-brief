// Master Tag Dictionary — Controlled taxonomy for secondary topics
// Tags are organized by primary hub but can be used across hubs
// Each tag has a slug (URL), label (display), hub (primary association), and SEO description

export interface TagDefinition {
    slug: string;
    label: string;
    hub: string;
    description: string;
}

export const TAG_DICTIONARY: TagDefinition[] = [
    // ═══════════════════════════════════════════════
    // Climate & Energy Systems
    // ═══════════════════════════════════════════════

    // PlanetDash System Indicators
    {
        slug: 'carbon-budget',
        label: 'Carbon budget',
        hub: 'Climate & Energy Systems',
        description: 'Tracking the remaining global carbon budget — the total CO₂ that can still be emitted while maintaining a chance of limiting warming to 1.5°C, based on IPCC AR6 assessments.'
    },
    {
        slug: 'global-temperature',
        label: 'Global temperature',
        hub: 'Climate & Energy Systems',
        description: 'Monitoring global mean surface temperature anomalies relative to pre-industrial baselines, tracking proximity to the Paris Agreement 1.5°C and 2°C thresholds.'
    },
    {
        slug: 'planetary-boundaries',
        label: 'Planetary boundaries',
        hub: 'Science & Data',
        description: 'Assessing the nine planetary boundaries framework from the Stockholm Resilience Centre — the safe operating space for humanity within Earth system processes.'
    },
    {
        slug: 'climate-tipping-points',
        label: 'Climate tipping points',
        hub: 'Climate & Energy Systems',
        description: 'Monitoring critical thresholds in the Earth system where small changes could trigger large, irreversible shifts — from ice sheet collapse to Amazon dieback and permafrost thaw.'
    },
    {
        slug: 'per-capita-emissions',
        label: 'Per capita emissions',
        hub: 'Climate & Energy Systems',
        description: 'Analyzing greenhouse gas emissions on a per-person basis across nations, revealing consumption-driven disparities and equity dimensions of the climate crisis.'
    },

    // Core system signals
    {
        slug: 'energy-transition',
        label: 'Energy transition',
        hub: 'Climate & Energy Systems',
        description: 'Tracking the global shift from fossil fuels to renewable energy systems, including policy drivers, deployment timelines, and infrastructure transformation across economies.'
    },
    {
        slug: 'fossil-fuel-phase-down',
        label: 'Fossil fuel phase-down',
        hub: 'Climate & Energy Systems',
        description: 'Monitoring commitments and progress toward reducing fossil fuel production and consumption, from COP agreements to national energy plans and stranded asset risk.'
    },
    {
        slug: 'renewable-capacity',
        label: 'Renewable capacity',
        hub: 'Climate & Energy Systems',
        description: 'Analyzing global solar, wind, and hydropower deployment trends, capacity additions, cost curves, and the pace of clean energy scaling relative to climate targets.'
    },
    {
        slug: 'grid-infrastructure',
        label: 'Grid infrastructure',
        hub: 'Climate & Energy Systems',
        description: 'Examining electricity grid modernization, transmission bottlenecks, storage integration, and the infrastructure investments required to support decarbonized power systems.'
    },
    {
        slug: 'electrification',
        label: 'Electrification',
        hub: 'Climate & Energy Systems',
        description: 'Covering the transition of transport, heating, and industrial processes from combustion to electric systems, including adoption rates and infrastructure readiness.'
    },

    // Policy mechanisms
    {
        slug: 'carbon-markets',
        label: 'Carbon markets',
        hub: 'Climate & Energy Systems',
        description: 'Analyzing emissions trading systems, carbon credit mechanisms, voluntary markets, and pricing signals shaping corporate and national decarbonization strategies.'
    },
    {
        slug: 'ndcs',
        label: 'NDCs',
        hub: 'Climate & Energy Systems',
        description: 'Tracking Nationally Determined Contributions under the Paris Agreement — their ambition, implementation gaps, and alignment with global temperature goals.'
    },
    {
        slug: 'climate-finance',
        label: 'Climate finance',
        hub: 'Climate & Energy Systems',
        description: 'Monitoring financial flows for mitigation and adaptation, including multilateral funds, private investment, and the gap between pledged and delivered climate finance.'
    },
    {
        slug: 'adaptation-finance',
        label: 'Adaptation finance',
        hub: 'Climate & Energy Systems',
        description: 'Examining funding mechanisms for climate resilience, from infrastructure hardening to social protection systems in vulnerable regions.'
    },
    {
        slug: 'methane-regulation',
        label: 'Methane regulation',
        hub: 'Climate & Energy Systems',
        description: 'Covering regulatory frameworks targeting methane emissions from oil and gas, agriculture, and waste sectors — a critical near-term lever for slowing warming.'
    },

    // Data & physical signals
    {
        slug: 'ocean-warming',
        label: 'Ocean warming',
        hub: 'Climate & Energy Systems',
        description: 'Tracking ocean heat content trends, thermal expansion, and the cascading effects of warming seas on weather patterns, marine ecosystems, and sea level rise.'
    },
    {
        slug: 'marine-heatwaves',
        label: 'Marine heatwaves',
        hub: 'Climate & Energy Systems',
        description: 'Monitoring extreme ocean temperature events, their increasing frequency and intensity, and impacts on coral reefs, fisheries, and coastal communities.'
    },
    {
        slug: 'extreme-weather',
        label: 'Extreme weather',
        hub: 'Climate & Energy Systems',
        description: 'Analyzing the link between climate change and intensifying weather events — hurricanes, heatwaves, floods, and droughts — including attribution science and economic costs.'
    },
    {
        slug: 'sea-level-rise',
        label: 'Sea level rise',
        hub: 'Climate & Energy Systems',
        description: 'Tracking global and regional sea level trends driven by thermal expansion and ice sheet loss, including projections, tipping points, and coastal adaptation needs.'
    },
    {
        slug: 'emissions-trends',
        label: 'Emissions trends',
        hub: 'Climate & Energy Systems',
        description: 'Analyzing global and sectoral greenhouse gas emission trajectories, tracking whether reductions align with Paris Agreement targets and net-zero pathways.'
    },

    // ═══════════════════════════════════════════════
    // Biodiversity & Oceans
    // ═══════════════════════════════════════════════
    {
        slug: 'coral-bleaching',
        label: 'Coral bleaching',
        hub: 'Biodiversity & Oceans',
        description: 'Monitoring mass coral bleaching events worldwide, the thermal stress thresholds driving them, and implications for reef-dependent ecosystems and coastal economies.'
    },
    {
        slug: 'protected-areas',
        label: 'Protected areas',
        hub: 'Biodiversity & Oceans',
        description: 'Tracking progress toward 30x30 conservation targets, marine and terrestrial protected area designations, enforcement effectiveness, and biodiversity outcomes.'
    },
    {
        slug: 'deforestation',
        label: 'Deforestation',
        hub: 'Biodiversity & Oceans',
        description: 'Monitoring forest loss rates, drivers including agriculture and extractive industries, and the effectiveness of regulatory and market-based interventions.'
    },
    {
        slug: 'ocean-acidification',
        label: 'Ocean acidification',
        hub: 'Biodiversity & Oceans',
        description: 'Tracking the decline in ocean pH driven by CO₂ absorption, its impact on shell-forming organisms, marine food webs, and long-term ocean chemistry shifts.'
    },
    {
        slug: 'fisheries-management',
        label: 'Fisheries management',
        hub: 'Biodiversity & Oceans',
        description: 'Analyzing sustainable fisheries governance, overfishing trends, stock assessments, and international cooperation on high-seas resource management.'
    },
    {
        slug: 'ecosystem-restoration',
        label: 'Ecosystem restoration',
        hub: 'Biodiversity & Oceans',
        description: 'Covering large-scale restoration initiatives for degraded ecosystems — wetlands, mangroves, forests — and their contributions to biodiversity and carbon sequestration.'
    },
    {
        slug: 'species-loss',
        label: 'Species loss',
        hub: 'Biodiversity & Oceans',
        description: 'Monitoring extinction rates, endangered species assessments, and the systemic drivers of biodiversity decline across terrestrial and marine environments.'
    },

    // ═══════════════════════════════════════════════
    // Policy, Governance & Finance
    // ═══════════════════════════════════════════════
    {
        slug: 'multilateral-negotiations',
        label: 'Multilateral negotiations',
        hub: 'Policy, Governance & Finance',
        description: 'Covering international climate and environmental negotiations — COP outcomes, treaty processes, and the diplomatic dynamics shaping global environmental governance.'
    },
    {
        slug: 'development-finance',
        label: 'Development finance',
        hub: 'Policy, Governance & Finance',
        description: 'Analyzing how development banks, sovereign funds, and bilateral aid channel capital toward sustainable development and climate-resilient infrastructure.'
    },
    {
        slug: 'green-bonds',
        label: 'Green bonds',
        hub: 'Policy, Governance & Finance',
        description: 'Tracking the growth and integrity of green bond markets, certification standards, and how debt instruments channel capital toward environmental projects.'
    },
    {
        slug: 'climate-risk-disclosure',
        label: 'Climate risk disclosure',
        hub: 'Policy, Governance & Finance',
        description: 'Examining mandatory and voluntary climate risk reporting frameworks — TCFD, ISSB standards — and their impact on corporate transparency and investor decisions.'
    },
    {
        slug: 'esg-regulation',
        label: 'ESG regulation',
        hub: 'Policy, Governance & Finance',
        description: 'Covering environmental, social, and governance regulatory frameworks worldwide, from EU taxonomy to SEC climate disclosure rules and anti-greenwashing measures.'
    },
    {
        slug: 'loss-and-damage',
        label: 'Loss and damage',
        hub: 'Policy, Governance & Finance',
        description: 'Tracking the emerging loss and damage finance architecture, including fund operationalization, eligibility criteria, and disbursement to climate-vulnerable nations.'
    },
    {
        slug: 'public-private-partnerships',
        label: 'Public-private partnerships',
        hub: 'Policy, Governance & Finance',
        description: 'Analyzing collaborative frameworks between governments and private sector actors for delivering climate infrastructure, innovation, and resilience at scale.'
    },

    // ═══════════════════════════════════════════════
    // Science & Data
    // ═══════════════════════════════════════════════
    {
        slug: 'climate-modeling',
        label: 'Climate modeling',
        hub: 'Science & Data',
        description: 'Covering advances in Earth system models, regional downscaling, and how computational climate science informs projections, risk assessments, and policy decisions.'
    },
    {
        slug: 'satellite-monitoring',
        label: 'Satellite monitoring',
        hub: 'Science & Data',
        description: 'Tracking how Earth observation satellites provide critical data on deforestation, emissions, ice coverage, ocean temperatures, and atmospheric composition.'
    },
    {
        slug: 'earth-observation',
        label: 'Earth observation',
        hub: 'Science & Data',
        description: 'Analyzing integrated observation systems — satellite, ground-based, and ocean sensors — that provide the empirical foundation for environmental science and policy.'
    },
    {
        slug: 'attribution-science',
        label: 'Attribution science',
        hub: 'Science & Data',
        description: 'Examining the scientific methods used to determine the role of climate change in specific weather events, informing liability, adaptation, and public understanding.'
    },
    {
        slug: 'scenario-analysis',
        label: 'Scenario analysis',
        hub: 'Science & Data',
        description: 'Covering SSP and RCP pathways, transition scenarios, and how different emission trajectories translate into physical, economic, and social outcomes.'
    },
    {
        slug: 'data-transparency',
        label: 'Data transparency',
        hub: 'Science & Data',
        description: 'Analyzing open data initiatives, reporting standards, and verification systems that ensure environmental claims and national inventories are credible and accessible.'
    },

    // ═══════════════════════════════════════════════
    // Technology & Innovation
    // ═══════════════════════════════════════════════
    {
        slug: 'carbon-capture',
        label: 'Carbon capture',
        hub: 'Technology & Innovation',
        description: 'Covering carbon capture, utilization, and storage technologies — from industrial point-source capture to geological sequestration and enhanced weathering approaches.'
    },
    {
        slug: 'battery-storage',
        label: 'Battery storage',
        hub: 'Technology & Innovation',
        description: 'Tracking advances in energy storage technology — lithium-ion, solid-state, flow batteries — and their role in enabling grid-scale renewable energy integration.'
    },
    {
        slug: 'hydrogen-systems',
        label: 'Hydrogen systems',
        hub: 'Technology & Innovation',
        description: 'Analyzing green, blue, and grey hydrogen production pathways, infrastructure development, and the role of hydrogen in decarbonizing hard-to-abate industrial sectors.'
    },
    {
        slug: 'direct-air-capture',
        label: 'Direct air capture',
        hub: 'Technology & Innovation',
        description: 'Monitoring the development and scaling of technologies that capture CO₂ directly from ambient air, including cost trajectories and deployment timelines.'
    },
    {
        slug: 'grid-digitalization',
        label: 'Grid digitalization',
        hub: 'Technology & Innovation',
        description: 'Covering smart grid technologies, demand response systems, and digital infrastructure enabling more efficient and resilient electricity networks.'
    },
    {
        slug: 'ai-for-climate',
        label: 'AI for climate',
        hub: 'Technology & Innovation',
        description: 'Examining how artificial intelligence and machine learning accelerate climate research, optimize energy systems, and enhance environmental monitoring capabilities.'
    },

    // ═══════════════════════════════════════════════
    // Planetary Health & Society
    // ═══════════════════════════════════════════════
    {
        slug: 'food-security',
        label: 'Food security',
        hub: 'Planetary Health & Society',
        description: 'Analyzing how climate change, soil degradation, and water stress affect global food production, supply chains, and access to nutrition across vulnerable regions.'
    },
    {
        slug: 'heat-stress',
        label: 'Heat stress',
        hub: 'Planetary Health & Society',
        description: 'Tracking the public health impact of rising temperatures — heatwave mortality, labor productivity losses, and the disproportionate burden on tropical and urban populations.'
    },
    {
        slug: 'climate-migration',
        label: 'Climate migration',
        hub: 'Planetary Health & Society',
        description: 'Examining climate-driven displacement and migration patterns, governance frameworks for climate refugees, and the intersection of environmental and social vulnerability.'
    },
    {
        slug: 'public-health-risk',
        label: 'Public health risk',
        hub: 'Planetary Health & Society',
        description: 'Covering the health consequences of environmental degradation — air pollution, vector-borne diseases, mental health impacts, and cascading risks from climate disruption.'
    },
    {
        slug: 'urban-resilience',
        label: 'Urban resilience',
        hub: 'Planetary Health & Society',
        description: 'Analyzing how cities prepare for and adapt to climate impacts through infrastructure upgrades, green planning, flood defenses, and heat mitigation strategies.'
    },
    {
        slug: 'water-security',
        label: 'Water security',
        hub: 'Planetary Health & Society',
        description: 'Monitoring freshwater availability, drought patterns, groundwater depletion, and the governance challenges of ensuring equitable access to clean water under climate stress.'
    },
];

// ═══════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════

/** Get a tag definition by its slug */
export const getTagBySlug = (slug: string): TagDefinition | undefined =>
    TAG_DICTIONARY.find(t => t.slug === slug);

/** Get a tag definition by its label (case-insensitive) */
export const getTagByLabel = (label: string): TagDefinition | undefined =>
    TAG_DICTIONARY.find(t => t.label.toLowerCase() === label.toLowerCase());

/** Get all tags associated with a specific hub */
export const getTagsByHub = (hub: string): TagDefinition[] =>
    TAG_DICTIONARY.filter(t => t.hub === hub);

/** Get all unique hub names from the dictionary */
export const getTagHubs = (): string[] =>
    [...new Set(TAG_DICTIONARY.map(t => t.hub))];

/** Convert a tag label to its URL slug */
export const tagLabelToSlug = (label: string): string => {
    // First try to find it in the dictionary
    const found = getTagByLabel(label);
    if (found) return found.slug;
    // Fallback: generate slug from label
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

/** Get all tags as a flat list */
export const getAllTags = (): TagDefinition[] => TAG_DICTIONARY;
