import React, { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle, Check, Search, Plus } from 'lucide-react';
import { TAG_DICTIONARY, getTagByLabel, TagDefinition } from '../data/tagDictionary';

interface TagSelectorProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange, maxTags = 5 }) => {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [approvedCustomTags, setApprovedCustomTags] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if a tag is in the dictionary
    const isInDictionary = (tag: string) => !!getTagByLabel(tag);

    // Get dictionary suggestions filtered by input
    const getSuggestions = (): TagDefinition[] => {
        if (!inputValue.trim()) return TAG_DICTIONARY.filter(t => !selectedTags.some(s => s.toLowerCase() === t.label.toLowerCase()));
        const query = inputValue.toLowerCase();
        return TAG_DICTIONARY.filter(t =>
            t.label.toLowerCase().includes(query) &&
            !selectedTags.some(s => s.toLowerCase() === t.label.toLowerCase())
        );
    };

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        if (selectedTags.some(t => t.toLowerCase() === trimmed.toLowerCase())) return;
        if (selectedTags.length >= maxTags) return;

        onChange([...selectedTags, trimmed]);
        setInputValue('');
        setIsDropdownOpen(false);
        inputRef.current?.focus();
    };

    const removeTag = (index: number) => {
        const tag = selectedTags[index];
        setApprovedCustomTags(prev => prev.filter(t => t.toLowerCase() !== tag.toLowerCase()));
        onChange(selectedTags.filter((_, i) => i !== index));
    };

    const approveCustomTag = (tag: string) => {
        setApprovedCustomTags(prev => [...prev, tag]);
    };

    const isCustomApproved = (tag: string) => approvedCustomTags.some(t => t.toLowerCase() === tag.toLowerCase());

    const suggestions = getSuggestions();
    const hasExactMatch = inputValue.trim() && TAG_DICTIONARY.some(t => t.label.toLowerCase() === inputValue.trim().toLowerCase());
    const showAddCustom = inputValue.trim().length > 2 && !hasExactMatch && !selectedTags.some(t => t.toLowerCase() === inputValue.trim().toLowerCase());

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                <span>Secondary Topics — Controlled Tags</span>
                <span className={`text-[9px] ${selectedTags.length >= maxTags ? 'text-amber-500' : 'text-zinc-600'}`}>
                    {selectedTags.length}/{maxTags}
                </span>
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {selectedTags.map((tag, i) => {
                    const inDict = isInDictionary(tag);
                    const isApproved = isCustomApproved(tag);
                    const isWarning = !inDict && !isApproved;

                    return (
                        <span
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${isWarning
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : inDict
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                }`}
                        >
                            {isWarning && <AlertTriangle size={10} className="flex-shrink-0" />}
                            {inDict && <Check size={10} className="flex-shrink-0" />}
                            {!inDict && isApproved && <Plus size={10} className="flex-shrink-0" />}
                            <span className="truncate max-w-[180px]">{tag}</span>

                            {isWarning && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); approveCustomTag(tag); }}
                                    className="text-amber-500 hover:text-white px-1 text-[9px] font-bold uppercase tracking-wider hover:bg-amber-500/20 rounded transition-colors"
                                    title="Approve this custom tag"
                                >
                                    OK
                                </button>
                            )}

                            <button
                                onClick={() => removeTag(i)}
                                className="text-current opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X size={10} />
                            </button>
                        </span>
                    );
                })}
            </div>

            {/* Input + Dropdown */}
            {selectedTags.length < maxTags && (
                <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            ref={inputRef}
                            className="w-full bg-zinc-950/30 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500/30 focus:outline-none transition-colors"
                            placeholder="Search tags or type new..."
                            value={inputValue}
                            onChange={e => {
                                setInputValue(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && inputValue.trim()) {
                                    e.preventDefault();
                                    // If there's an exact match in suggestions, use its label
                                    const exact = TAG_DICTIONARY.find(t => t.label.toLowerCase() === inputValue.trim().toLowerCase());
                                    addTag(exact ? exact.label : inputValue.trim());
                                } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
                                    removeTag(selectedTags.length - 1);
                                }
                            }}
                        />
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (suggestions.length > 0 || showAddCustom) && (
                        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                            {suggestions.slice(0, 10).map(tag => (
                                <button
                                    key={tag.slug}
                                    onClick={() => addTag(tag.label)}
                                    className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors group flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs text-white group-hover:text-emerald-400 transition-colors">{tag.label}</span>
                                        <span className="text-[9px] text-zinc-600">{tag.hub}</span>
                                    </div>
                                    <Check size={10} className="text-emerald-500/50 flex-shrink-0" />
                                </button>
                            ))}
                            {showAddCustom && (
                                <>
                                    {suggestions.length > 0 && <div className="border-t border-white/5" />}
                                    <button
                                        onClick={() => addTag(inputValue.trim())}
                                        className="w-full text-left px-3 py-2 hover:bg-amber-500/5 transition-colors group flex items-center gap-2"
                                    >
                                        <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-amber-400">Add "{inputValue.trim()}" as custom tag</span>
                                            <span className="text-[9px] text-zinc-600">Not in controlled dictionary — will need approval</span>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            <p className="text-[9px] text-zinc-600 italic">
                Select from the controlled dictionary for consistent SEO. Custom tags require explicit approval.
            </p>
        </div>
    );
};

export default TagSelector;
