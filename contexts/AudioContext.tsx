import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Article } from '../types';
import { generateSpeech } from '../services/geminiService';

// Audio Helpers
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

interface AudioContextType {
    currentArticle: Article | null;
    isPlaying: boolean;
    isLoading: boolean;
    playArticle: (article: Article) => Promise<void>;
    pauseAudio: () => void;
    resumeAudio: () => void;
    stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const startTimeRef = useRef<number>(0);
    const pauseTimeRef = useRef<number>(0);

    const stopAudio = useCallback(() => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
            } catch (e) {
                // Already stopped
            }
            sourceNodeRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        audioBufferRef.current = null;
        startTimeRef.current = 0;
        pauseTimeRef.current = 0;
        setIsPlaying(false);
        setCurrentArticle(null);
    }, []);

    const pauseAudio = useCallback(() => {
        if (sourceNodeRef.current && audioContextRef.current && isPlaying) {
            pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
            sourceNodeRef.current.stop();
            sourceNodeRef.current = null;
            setIsPlaying(false);
        }
    }, [isPlaying]);

    const resumeAudio = useCallback(() => {
        if (audioBufferRef.current && audioContextRef.current && !isPlaying) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);

            startTimeRef.current = audioContextRef.current.currentTime - pauseTimeRef.current;
            source.start(0, pauseTimeRef.current);
            sourceNodeRef.current = source;

            source.onended = () => {
                stopAudio();
            };

            setIsPlaying(true);
        }
    }, [isPlaying, stopAudio]);

    const playArticle = useCallback(async (article: Article) => {
        // If same article is already playing, just toggle pause/play
        if (currentArticle?.id === article.id && audioBufferRef.current) {
            if (isPlaying) {
                pauseAudio();
            } else {
                resumeAudio();
            }
            return;
        }

        // Stop current playback
        stopAudio();

        setIsLoading(true);
        setCurrentArticle(article);

        try {
            // Prepare text to read
            const contentArray = Array.isArray(article.content) ? article.content : [article.content];
            const textToRead = `${article.title}. ${article.excerpt}. ${contentArray.join(' ')}`;

            const base64Audio = await generateSpeech(textToRead, article.id);

            if (!base64Audio) {
                alert("Could not generate audio summary. Please try again.");
                setIsLoading(false);
                setCurrentArticle(null);
                return;
            }

            // Create audio context and decode
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = audioCtx;

            const audioBytes = decode(base64Audio);
            const alignedBytes = new Uint8Array(audioBytes);
            const audioBuffer = await decodeAudioData(alignedBytes, audioCtx, 24000, 1);
            audioBufferRef.current = audioBuffer;

            // Create and play source
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);

            startTimeRef.current = audioCtx.currentTime;
            pauseTimeRef.current = 0;
            source.start(0);
            sourceNodeRef.current = source;

            source.onended = () => {
                stopAudio();
            };

            setIsPlaying(true);
            setIsLoading(false);
        } catch (e) {
            console.error("Audio playback error", e);
            alert("Error playing audio.");
            stopAudio();
            setIsLoading(false);
        }
    }, [currentArticle, isPlaying, pauseAudio, resumeAudio, stopAudio]);

    return (
        <AudioContext.Provider value={{
            currentArticle,
            isPlaying,
            isLoading,
            playArticle,
            pauseAudio,
            resumeAudio,
            stopAudio
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
