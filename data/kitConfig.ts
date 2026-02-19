
// Kit.com (ConvertKit) Tag Configuration
// Map internal Hub Names to Kit Tag IDs

export const KIT_CONFIG = {
    FORM_ID: 'YOUR_FORM_ID', // Optional: Default form ID if needed
    TAGS: {
        'Climate & Energy Systems': '16182843',
        'Biodiversity & Oceans': '16182844',
        'Policy, Governance & Finance': '16182845',
        'Science & Data': '16182846',
        'Technology & Innovation': '16182847',
        'Planetary Health & Society': '16182848'
    }
};

export const getKitTagId = (hubName: string): string | null => {
    return KIT_CONFIG.TAGS[hubName as keyof typeof KIT_CONFIG.TAGS] || null;
};
