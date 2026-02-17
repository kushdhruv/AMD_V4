
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Video, Clapperboard, MonitorPlay, Smartphone, Clock, Sparkles } from "lucide-react";
import { deductCredits, PRICING } from "@/lib/economy";
import { supabase } from "@/lib/supabase/client";
import { clsx } from "clsx";

const STYLES = [
  { id: "realistic", name: "Cinematic Realism", desc: "Photorealistic, movie-like quality", color: "from-blue-500 to-indigo-600" },
  { id: "anime", name: "Anime Style", desc: "Japanese animation aesthetic", color: "from-pink-500 to-rose-500" },
  { id: "3d", name: "3D Render", desc: "Clean, modern 3D motion graphics", color: "from-purple-500 to-violet-600" },
];

export default function VideoGeneratorPage() {
  const [script, setScript] = useState("");
  const [style, setStyle] = useState("realistic");
  const [duration, setDuration] = useState("5");
  const [aspect, setAspect] = useState("16:9");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    
    // Check Credits
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) {
        alert("Please login");
        setGenerating(false);
        return;
    }

    const hasCredits = await deductCredits(user.id, PRICING.video, `Generated Video (${duration}s)`);
    if(!hasCredits) {
        alert(`Insufficient credits! Video generation costs ${PRICING.video} credits.`);
        setGenerating(false);
        return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setResult("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); // Dummy video
    setGenerating(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-[400px] flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard/generators" className="p-2 hover:bg-neutral-800 rounded-full transition">
                <ArrowLeft size={20} className="text-neutral-400" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Video className="text-primary" size={24} />
                Video Generator
            </h1>
        </div>

        {/* Script Input */}
        <div>
            <label className="block text-sm font-bold text-neutral-300 mb-2">Video Script / Prompt</label>
            <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition min-h-[120px] resize-none"
                placeholder="Describe your video scene... e.g. A futuristic city timeline showing the evolution of AI technology, cinematic lighting, 4k."
            />
            <p className="text-xs text-neutral-500 mt-2 text-right">{script.length}/500 chars</p>
        </div>

        {/* Style Selection */}
        <div>
            <label className="block text-sm font-bold text-neutral-300 mb-3">Visual Style</label>
            <div className="grid gap-3">
                {STYLES.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={clsx(
                            "p-3 rounded-xl border text-left flex items-center gap-4 transition-all relative overflow-hidden",
                            style === s.id ? "border-primary bg-primary/10" : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                        )}
                    >
                        <div className={clsx("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-lg", s.color)}>
                            <Clapperboard size={20} />
                        </div>
                        <div>
                            <div className={clsx("font-bold text-sm", style===s.id ? "text-white" : "text-neutral-300")}>{s.name}</div>
                            <div className="text-xs text-neutral-500">{s.desc}</div>
                        </div>
                        {style === s.id && <div className="absolute right-4 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" />}
                    </button>
                ))}
            </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Duration</label>
                <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                    {["5", "10"].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDuration(d)}
                            className={clsx(
                                "flex-1 py-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1",
                                duration === d ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                            )}
                        >
                            <Clock size={12} /> {d}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Aspect Ratio */}
            <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Aspect Ratio</label>
                <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                    {[
                        { id: "16:9", icon: MonitorPlay, label: "Landscape" },
                        { id: "9:16", icon: Smartphone, label: "Portrait" }
                    ].map((a) => (
                        <button
                            key={a.id}
                            onClick={() => setAspect(a.id)}
                            className={clsx(
                                "flex-1 py-2 rounded-md text-xs font-bold transition flex items-center justify-center gap-1",
                                aspect === a.id ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                            )}
                        >
                            <a.icon size={12} /> {a.id}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <button
            onClick={handleGenerate}
            disabled={!script.trim() || generating}
            className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 mt-auto shadow-lg shadow-primary/20"
        >
            {generating ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Video...
                </>
            ) : (
                <>
                    <Sparkles size={20} />
                    Generate Video
                </>
            )}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-black rounded-2xl border border-neutral-800 overflow-hidden relative flex items-center justify-center group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-50" />
         
         {result ? (
             <div className="relative w-full max-w-4xl aspect-video bg-black shadow-2xl rounded-lg overflow-hidden border border-neutral-800">
                 <video 
                    src={result} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-contain"
                 />
                 <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur rounded text-xs font-mono text-white border border-white/10">
                    Generated by AI • {style} • {duration}s
                 </div>
             </div>
         ) : (
             <div className="text-center relative z-10 px-6">
                 <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800 group-hover:border-primary/50 transition duration-500">
                    <Video className="text-neutral-600 group-hover:text-primary transition duration-500" size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Preview Canvas</h2>
                 <p className="text-neutral-500 max-w-md mx-auto">
                    Your generated video will appear here. Enter a prompt and select a style to begin.
                 </p>
             </div>
         )}
      </div>

    </div>
  );
}
