import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Check, Bell, Loader2 } from 'lucide-react';

interface SubscribeViewProps {
  onBack: () => void;
}

import { CATEGORIES } from '../data/categories';

const topics = CATEGORIES.map(cat => ({ id: cat.id, label: cat.label }));

const SubscribeView: React.FC<SubscribeViewProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    // Capture user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const response = await fetch('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, topics: selectedTopics, timezone }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert('Failed to subscribe. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Could not connect to the subscription server.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-zinc-950 min-h-screen animate-fade-in text-white pt-32 pb-24 flex flex-col items-center justify-center">
        <div className="bg-zinc-900/50 border border-white/10 p-12 rounded-2xl max-w-lg text-center backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-news-accent/5 pointer-events-none"></div>
          <div className="w-16 h-16 bg-news-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Check size={32} className="text-black" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4">You're on the list.</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            We've sent a confirmation email to <span className="text-white font-bold">{email}</span>.
            Your first curated intelligence briefing will arrive next Friday.
          </p>
          <button
            onClick={onBack}
            className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
          >
            Return to Headlines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen animate-fade-in text-white pt-48 pb-24">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-3xl">



        <div className="text-center mb-12">
          <span className="text-news-accent font-bold uppercase tracking-widest text-xs mb-4 block animate-pulse">Weekly Digest</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Keep Me Up To Date</h1>
          <p className="text-xl text-gray-300 font-light">
            Select the topics that matter to you. We'll send you a concise summary of the week's most critical breakthroughs and policy shifts. No noise, just signal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">

          <div className="mb-10">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-serif font-bold text-white">Select Topics</h3>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-bold uppercase tracking-widest text-news-accent hover:text-white transition-colors"
              >
                {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => handleTopicToggle(topic.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between group ${selectedTopics.includes(topic.id)
                    ? 'bg-news-accent/10 border-news-accent text-white'
                    : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                >
                  <span className="font-medium text-sm">{topic.label}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedTopics.includes(topic.id)
                    ? 'bg-news-accent border-news-accent'
                    : 'border-white/20 group-hover:border-white/40'
                    }`}>
                    {selectedTopics.includes(topic.id) && <Check size={12} className="text-black" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-news-accent transition-colors"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || selectedTopics.length === 0}
            className="w-full bg-news-accent hover:bg-emerald-400 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-news-accent/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Subscribe to Updates
                <Bell size={18} />
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-gray-500 mt-4">
            We respect your inbox. Unsubscribe at any time. Zero spam guaranteed.
          </p>

        </form>

      </div>
    </div>
  );
};

export default SubscribeView;