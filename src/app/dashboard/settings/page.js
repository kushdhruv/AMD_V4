
"use client";

import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { addDemoCredits } from "@/lib/economy";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleDemoCredits = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          alert("Please login first");
          setLoading(false);
          return;
      }

      const success = await addDemoCredits(user.id);
      if (success) {
          alert("🎉 Added 1000 Credits! Refresh the page to see your balance.");
          // Ideally refresh context or router
      } else {
          alert("Failed to add credits. Did you run the SQL migration?");
      }
      setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <SettingsIcon className="text-neutral-500" />
        Settings
      </h1>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30">
            <h3 className="font-bold text-white mb-4">Account</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">Email</span>
                    <span className="text-white text-sm">user@example.com</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">Plan</span>
                    <span className="text-primary text-sm font-bold">Free Tier</span>
                </div>
            </div>
        </div>

        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 opacity-50">
            <h3 className="font-bold text-white mb-4">API Keys (Coming Soon)</h3>
            <p className="text-sm text-neutral-500">Manage your custom API keys for higher rate limits.</p>
        </div>

        {/* Demo Section */}
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30">
            <h3 className="font-bold text-white mb-4">Demo Zone 🚧</h3>
            <p className="text-sm text-neutral-500 mb-4">Need credits to test features? Click below to top up.</p>
            <button 
                onClick={handleDemoCredits}
                disabled={loading}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-bold border border-neutral-700 disabled:opacity-50"
            >
                {loading ? "Adding..." : "Claim 1000 Credits"}
            </button>
        </div>
      </div>
    </div>
  );
}
