import { Article } from '../types';
import { CATEGORIES } from './categories';

// --- Types ---

export interface DataSignal {
    id: string;
    label: string;
    value: string;
    change: string; // e.g., "+1.2%", "Record High"
    trend: 'up' | 'down' | 'neutral';
    color: 'red' | 'green' | 'amber' | 'blue';
    description?: string;
    relatedCategoryId?: string;
    tagSlug: string; // Creates link to topic page
}

export interface HomepageConfig {
    hero: {
        articleId: string;
        headlineOverride?: string;
        subheadingOverride?: string;
    };
    policySection: {
        title: string;
        articleIds: string[]; // 3-5 articles
    };
    dataSignals: DataSignal[];
    analysisSection: {
        title: string;
        articleIds: string[]; // 3-4 articles
    };
    topicHubs: {
        title: string;
        pillars: typeof CATEGORIES;
    };
}

// --- Configuration ---

export const homepageConfig: HomepageConfig = {
    hero: {
        articleId: 'hero-demo-1', // Special Hero Placeholder
        headlineOverride: 'GLOBAL HERO: Major Environmental Shift Observed',
        subheadingOverride: 'This is the main hero article for the design demo. It should have the most prominent placement and a high-impact image.',
    },
    policySection: {
        title: 'Latest Policy Developments',
        articleIds: [
            'placeholder-policy-1',
            'placeholder-policy-2',
            'placeholder-policy-3',
            'placeholder-policy-4'
        ]
    },
    dataSignals: [
        {
            id: 'co2',
            label: 'Atmospheric CO2',
            value: '426.8 ppm',
            trend: 'up',
            change: '+2.4 ppm',
            color: 'red',
            relatedCategoryId: 'Climate & Energy Systems',
            tagSlug: 'carbon-budget'
        },
        {
            id: 'temp',
            label: 'Global Mean Temp',
            value: '+1.54°C',
            trend: 'up',
            change: 'vs pre-industrial',
            color: 'red',
            relatedCategoryId: 'Climate & Energy Systems',
            tagSlug: 'global-temperature'
        },
        {
            id: 'energy',
            label: 'Renewable Capacity',
            value: '4,100 GW',
            trend: 'up',
            change: '+10% YoY',
            color: 'green',
            relatedCategoryId: 'Climate & Energy Systems', // Or Tech
            tagSlug: 'renewable-capacity'
        },
        {
            id: 'ice',
            label: 'Arctic Sea Ice',
            value: '3.82M km²',
            change: '-4.2% YoY',
            trend: 'down',
            color: 'amber',
            description: 'September minimum extent near record lows.',
            relatedCategoryId: 'Biodiversity & Oceans',
            tagSlug: 'climate-tipping-points'
        }
    ],
    analysisSection: {
        title: 'In-Depth Analysis',
        articleIds: [
            'placeholder-climate-1',
            'placeholder-biodiversity-1',
            'placeholder-science-1',
            'placeholder-technology-1'
        ]
    },
    topicHubs: {
        title: 'Intelligence by Sector',
        pillars: CATEGORIES // Uses the imported 6 categories
    }
};
