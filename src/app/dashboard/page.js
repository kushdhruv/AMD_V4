
"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Zap, Globe, Smartphone, PenTool, Layout, FileText, 
  ArrowUpRight, Plus 
} from 'lucide-react';

const QuickActionCard = ({ title, icon: Icon, color, href, desc }) => (
  <Link 
    href={href}
    className="glass-card p-6 hover:bg-white/5 transition-all group flex flex-col justify-between h-48"
  >
    <div className="flex justify-between items-start">
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
        <ArrowUpRight size={16} />
      </div>
    </div>
    <div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-text-secondary text-xs">{desc}</p>
    </div>
  </Link>
);

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, Creator</h1>
          <p className="text-text-secondary">Ready to launch your next big event?</p>
        </div>
        <button className="btn-primary text-white">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase mb-4 tracking-wider">Create New</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <QuickActionCard 
            title="Event Website" 
            icon={Globe} 
            color="text-blue-400" 
            href="/dashboard/website-builder" 
            desc="Generate a landing page from a prompt."
          />
          <QuickActionCard 
            title="Native App" 
            icon={Smartphone} 
            color="text-purple-400" 
            href="/dashboard/app-builder" 
            desc="Build Android APK for announcements."
          />
          <QuickActionCard 
            title="Promo Video" 
            icon={Layout} 
            color="text-pink-400" 
            href="/dashboard/generators/video" 
            desc="Create social media hype videos."
          />
          <QuickActionCard 
            title="Event Poster" 
            icon={PenTool} 
            color="text-orange-400" 
            href="/dashboard/generators/poster" 
            desc="Design stunning posters instantly."
          />
          <QuickActionCard 
            title="Certificates" 
            icon={FileText} 
            color="text-green-400" 
            href="/dashboard/utility-apps/certificates" 
            desc="Bulk generate participant certs."
          />
          <QuickActionCard 
            title="Registration" 
            icon={Zap} 
            color="text-yellow-400" 
            href="/dashboard/utility-apps/registration" 
            desc="Setup forms and QR ticketing."
          />
        </div>
      </section>

      {/* Recent Projects (Placeholder) */}
      <section className="pt-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        
        <div className="glass-card p-12 text-center text-text-secondary">
            <div className="mb-4 text-4xl">📂</div>
            <p>No active projects yet.</p>
            <p className="text-xs mt-2">Start by selecting a tool above!</p>
        </div>
      </section>

    </div>
  );
}
