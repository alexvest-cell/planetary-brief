import React from 'react';
import { Section } from '../types';
import { Bell, ShieldCheck } from 'lucide-react';

interface ContactProps {
  onShowAbout: () => void;
  onSubscribeClick: () => void;
}

const Contact: React.FC<ContactProps> = ({ onShowAbout, onSubscribeClick }) => {
  return (
    <footer id={Section.CONTACT} className="py-12 bg-black border-t border-white/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand & Rights */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-serif font-bold text-white mb-2">Planetary Brief</h2>
            <p className="text-xs text-news-muted">© {new Date().getFullYear()} Global Environmental Intelligence.</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onShowAbout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              <ShieldCheck size={14} />
              About
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Contact;