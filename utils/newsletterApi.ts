
// Frontend Newsletter API Wrapper

export interface NewsletterStats {
    total_subscribers: number;
    page: number;
    total_pages: number;
}

export interface Subscriber {
    id: number;
    first_name: string;
    email_address: string;
    state: string;
    created_at: string;
    tags?: { id: number; name: string }[];
}

export const subscribeToNewsletter = async (email: string, topics: string[]): Promise<any> => {
    const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, topics })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
};

export const getNewsletterStats = async (): Promise<NewsletterStats> => {
    const res = await fetch('/api/newsletter/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
};

export const getSubscribers = async (page = 1): Promise<{ subscribers: Subscriber[], total_subscribers: number, total_pages: number }> => {
    const res = await fetch(`/api/newsletter/subscribers?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch subscribers');
    return await res.json();
};

export const generateDigestPreview = async (data: any): Promise<{ html: string }> => {
    const res = await fetch('/api/newsletter/generate-digest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to generate digest');
    return await res.json();
};
