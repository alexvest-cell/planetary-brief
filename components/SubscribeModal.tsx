import React, { useState, useEffect } from 'react';
import { X, Mail, Check, Bell, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

import { subscribeToNewsletter } from '../utils/newsletterApi';
import { getKitTagId } from '../data/kitConfig';

const topics = CATEGORIES.map(cat => ({ id: cat.id, label: cat.label }));

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            setEmail('');
            setSelectedTopics([]);
        }
    }, [isOpen]);

    const handleTopicToggle = (id: string) => {
        if (selectedTopics.includes(id)) {
            setSelectedTopics(selectedTopics.filter(t => t !== id));
        } else {
            setSelectedTopics([...selectedTopics, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedTopics.length === topics.length) {
            setSelectedTopics([]);
        } else {
            setSelectedTopics(topics.map(t => t.id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || selectedTopics.length === 0) return;

        setIsSubmitting(true);

        // Map internal Hub IDs to Kit Tag IDs
        const kitTagIds = selectedTopics
            .map(topic => getKitTagId(topic))
            .filter((id): id is string => id !== null);

        // Fallback: If no tags mapped (e.g. local dev without config), send raw topic names
        // The backend might handle them or we might just want to capture the email.
        const finalTags = kitTagIds.length > 0 ? kitTagIds : selectedTopics;

        try {
            await subscribeToNewsletter(email, finalTags);
            setIsSuccess(true);
        } catch (error: any) {
            console.error('Subscription error:', error);
            // Show actual error message for debugging
            alert(`Subscription failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:items-center sm:pt-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-zinc-950 border border-white/10 w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[85vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50">
                    <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <Bell size={18} className="text-news-accent" />
                        Weekly Intelligence Briefing
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-news-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                <Check size={32} className="text-black" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">You're on the list.</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Confirmation sent to <span className="text-white font-bold">{email}</span>.<br />
                                Your first update arrives next Friday.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Receive a structured weekly briefing on the most consequential developments across climate systems, biodiversity, governance, and planetary risk.
                                </p>

                                <div className="flex justify-between items-end mb-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Select Focus Areas</label>
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-[10px] font-bold uppercase tracking-widest text-news-accent hover:text-white transition-colors"
                                    >
                                        {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All Areas'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {topics.map(topic => (
                                        <div
                                            key={topic.id}
                                            onClick={() => handleTopicToggle(topic.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between group ${selectedTopics.includes(topic.id)
                                                ? 'bg-news-accent/10 border-news-accent text-white'
                                                : 'bg-zinc-900 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="font-medium text-xs">{topic.label}</span>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedTopics.includes(topic.id)
                                                ? 'bg-news-accent border-news-accent'
                                                : 'border-white/20 group-hover:border-white/40'
                                                }`}>
                                                {selectedTopics.includes(topic.id) && <Check size={10} className="text-black" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-news-accent transition-colors"
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-news-accent hover:bg-emerald-400 text-black py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-news-accent/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    <>
                                        Activate Subscription
                                        <Bell size={16} />
                                    </>
                                )}
                            </button>



                            <p className="text-[10px] text-center text-zinc-600 mt-4">
                                One structured briefing every Tuesday. No promotional content. Unsubscribe at any time.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscribeModal;
