
"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
    })();
  }, []);

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
              <span className="text-white text-sm">{userEmail || "—"}</span>
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
      </div>
    </div>
  );
}
