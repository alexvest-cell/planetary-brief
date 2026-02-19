
export interface Development {
    date: string;
    headline: string;
    summary: string;
    link?: string;
}

export const HUB_DEVELOPMENTS: Record<string, Development[]> = {
    'Climate & Energy Systems': [
        { date: 'Q1 2026', headline: 'Global Stocktake Update', summary: 'New assessment reveals widening gap between pledges and implementation.' },
        { date: 'Q1 2026', headline: 'Renewable Capacity Milestone', summary: 'Global solar capacity exceeds coal for the first time in history.' },
        { date: 'Q4 2025', headline: 'Methane Regulation', summary: 'EU and US implement strict monitoring requirements for oil and gas sectors.' }
    ],
    'Biodiversity & Oceans': [
        { date: 'Q1 2026', headline: 'High Seas Treaty Ratification', summary: '60th nation ratifies the agreement, bringing it into legal force.' },
        { date: 'Q1 2026', headline: 'Amazon Deforestation Data', summary: 'Preliminary satellite data shows 12% reduction in primary forest loss YoY.' },
        { date: 'Q4 2025', headline: 'Coral Bleaching Event', summary: 'Fourth global bleaching event confirmed by NOAA, affecting 54% of reef areas.' }
    ],
    'Policy, Governance & Finance': [
        { date: 'Q1 2026', headline: 'CBAM Expansion', summary: 'EU signals inclusion of organic chemicals and polymers in carbon border mechanism.' },
        { date: 'Q1 2026', headline: 'Climate Finance Target', summary: 'NCQG negotiations stall over donor base definition.' },
        { date: 'Q4 2025', headline: 'ISSB Adoption', summary: 'Brazil and UK mandate ISSB sustainability disclosure standards.' }
    ],
    'Science & Data': [
        { date: 'Q1 2026', headline: 'AR7 Cycle Launch', summary: 'IPCC working groups define scoping meeting priorities for Seventh Assessment.' },
        { date: 'Q1 2026', headline: 'Ocean Heat Record', summary: 'North Atlantic surface temperatures breach 2024 records by 0.2°C.' },
        { date: 'Q4 2025', headline: 'Tipping Points Report', summary: 'New methodology confirms AMOC destabilization signals.' }
    ],
    'Technology & Innovation': [
        { date: 'Q1 2026', headline: 'Solid State Battery Breakthrough', summary: 'Commercial pilot production begins for 500Wh/kg cells.' },
        { date: 'Q1 2026', headline: 'DAC Hub Funding', summary: 'US DOE announces $1.2B for next-gen direct air capture facilities.' },
        { date: 'Q4 2025', headline: 'Green Hydrogen Auctions', summary: 'European Hydrogen Bank clears €800M in support for projected capacity.' }
    ],
    'Planetary Health & Society': [
        { date: 'Q1 2026', headline: 'Air Quality Guidelines', summary: 'WHO revises PM2.5 targets based on new cardiovascular impact data.' },
        { date: 'Q1 2026', headline: 'Urban Heat Island Study', summary: 'Analysis of 500 cities shows cooling intervention potential of 2.5°C.' },
        { date: 'Q4 2025', headline: 'Plastic Treaty Draft', summary: 'Zero draft released with contentious production cap provisions.' }
    ]
};
