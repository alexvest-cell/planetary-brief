
import { Wind, Activity, Zap, Droplets, Globe, Scale } from 'lucide-react';

export interface RelatedSystem {
    label: string;
    slug: string;
    context: string;
    icon: any;
}

export const HUB_RELATED: Record<string, RelatedSystem[]> = {
    'Climate & Energy Systems': [
        { label: 'Policy, Governance & Finance', slug: 'policy-governance-and-finance', context: 'Strategic regulation', icon: Scale },
        { label: 'Technology & Innovation', slug: 'technology-and-innovation', context: 'Deployment solutions', icon: Zap },
        { label: 'Planetary Health & Society', slug: 'planetary-health-and-society', context: 'Human impact', icon: Activity }
    ],
    'Biodiversity & Oceans': [
        { label: 'Climate & Energy Systems', slug: 'climate-and-energy-systems', context: 'Driver of loss', icon: Wind },
        { label: 'Planetary Health & Society', slug: 'planetary-health-and-society', context: 'Ecosystem services', icon: Activity },
        { label: 'Science & Data', slug: 'science-and-data', context: 'Monitoring baselines', icon: Globe }
    ],
    'Policy, Governance & Finance': [
        { label: 'Climate & Energy Systems', slug: 'climate-and-energy-systems', context: 'Decarbonization targets', icon: Wind },
        { label: 'Technology & Innovation', slug: 'technology-and-innovation', context: 'Investment flows', icon: Zap },
        { label: 'Biodiversity & Oceans', slug: 'biodiversity-and-oceans', context: 'Nature-based solutions', icon: Droplets }
    ],
    'Science & Data': [
        { label: 'Climate & Energy Systems', slug: 'climate-and-energy-systems', context: 'Atmospheric physics', icon: Wind },
        { label: 'Biodiversity & Oceans', slug: 'biodiversity-and-oceans', context: 'Biological indicators', icon: Droplets },
        { label: 'Technology & Innovation', slug: 'technology-and-innovation', context: 'Remote sensing', icon: Zap }
    ],
    'Technology & Innovation': [
        { label: 'Climate & Energy Systems', slug: 'climate-and-energy-systems', context: 'Energy transition', icon: Wind },
        { label: 'Policy, Governance & Finance', slug: 'policy-governance-and-finance', context: 'Market mechanisms', icon: Scale },
        { label: 'Science & Data', slug: 'science-and-data', context: 'R&D pipeline', icon: Globe }
    ],
    'Planetary Health & Society': [
        { label: 'Climate & Energy Systems', slug: 'climate-and-energy-systems', context: 'Heat stress', icon: Wind },
        { label: 'Policy, Governance & Finance', slug: 'policy-governance-and-finance', context: 'Adaptation funding', icon: Scale },
        { label: 'Biodiversity & Oceans', slug: 'biodiversity-and-oceans', context: 'Food security', icon: Droplets }
    ]
};
