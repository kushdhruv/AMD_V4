
"use client";

import React, { useState } from 'react';
import { ShoppingBag, Star, Download, Globe, Smartphone, Layout, Zap, Check } from 'lucide-react';
import { deductCredits } from '@/lib/economy';
import { supabase } from '@/lib/supabase/client';
// import { toast } from 'sonner'; 

// Mock Data with Images
const MARKETPLACE_ITEMS = [
    { 
        id: 'web-1', type: 'Website', title: 'Tech Conference 2024', cost: 20, rating: 4.8, buys: 1200, icon: Globe,
        author: '@alex_dev', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        images: [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: 'web-2', type: 'Website', title: 'Music Festival Pro', cost: 25, rating: 4.9, buys: 850, icon: Globe,
        author: '@fest_master', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fest',
        images: [
            'https://images.unsplash.com/photo-1459749411177-7129984dddd3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1470229722913-7c0d2dbbafd3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97d890?auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: 'app-1', type: 'App', title: 'Club Community App', cost: 40, rating: 4.7, buys: 500, icon: Smartphone,
        author: '@club_ui', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=club',
        images: [
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: 'asset-1', type: 'Asset', title: 'Cyberpunk Poster Pack', cost: 5, rating: 5.0, buys: 2000, icon: Layout,
        author: '@neon_art', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon',
        images: [
            'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
        ]
    },
    { 
        id: 'vid-1', type: 'Video', title: 'Hype Reel Template', cost: 15, rating: 4.6, buys: 300, icon: Zap,
        author: '@video_wiz', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=video',
        images: [
            'https://images.unsplash.com/photo-1574717432707-c6780568150a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80'
        ]
    },
];

export default function MarketplacePage() {
    const [purchasing, setPurchasing] = useState(null);

    const handlePurchase = async (item) => {
        setPurchasing(item.id);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            alert("Please login first");
            setPurchasing(null);
            return;
        }

        const success = await deductCredits(user.id, item.cost, `Purchased ${item.title}`);
        
        if (success) {
            alert(`Successfully purchased ${item.title}!`);
        } else {
            alert("Insufficient credits! Please upgrade your plan.");
        }
        setPurchasing(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 p-4 md:p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
                    <p className="text-text-secondary">Discover premium templates, assets, and tools from the community.</p>
                </div>
                <div className="glass-card px-4 py-2 flex items-center gap-2 text-yellow-500">
                    <Star fill="currentColor" size={16} />
                    <span className="font-bold text-sm">Community Verified</span>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {MARKETPLACE_ITEMS.map((item) => (
                    <div key={item.id} className="glass-card group break-inside-avoid mb-6 hover:bg-white/5 transition-all overflow-hidden flex flex-col">
                        
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden group-hover:opacity-90 transition-opacity cursor-pointer">
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                                <item.icon size={12} /> {item.type}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-3 gap-1 mt-1 px-1">
                            {item.images.slice(1, 4).map((img, i) => (
                                <div key={i} className="aspect-square bg-neutral-800 overflow-hidden rounded-sm cursor-pointer hover:opacity-80">
                                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded shrink-0">
                                    <Star size={10} fill="currentColor" /> {item.rating}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <img src={item.authorAvatar} alt={item.author} className="w-6 h-6 rounded-full border border-white/10" />
                                <span className="text-xs text-text-secondary">{item.author}</span>
                                <span className="text-xs text-neutral-600">•</span>
                                <span className="text-xs text-text-secondary">{item.buys} buys</span>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="font-bold text-lg text-primary">
                                    {item.cost} <span className="text-xs text-text-secondary font-normal">credits</span>
                                </div>
                                <button 
                                    onClick={() => handlePurchase(item)}
                                    disabled={purchasing === item.id}
                                    className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50"
                                >
                                    {purchasing === item.id ? '...' : 'Get'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
