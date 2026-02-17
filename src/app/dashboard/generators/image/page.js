
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Sparkles, Download, Layers, Palette, Layout } from "lucide-react";
import { clsx } from "clsx";

const STYLES = [
  { id: "photo", name: "Photography", icon: "📸" },
  { id: "digital", name: "Digital Art", icon: "🎨" },
  { id: "neon", name: "Neon Cyberpunk", icon: "🌃" },
  { id: "minimal", name: "Minimalist", icon: "⚪" },
];

const FORMATS = [
  { id: "poster", name: "Event Poster", ratio: "2:3", width: "w-[200px]", height: "h-[300px]" },
  { id: "banner", name: "Web Banner", ratio: "16:9", width: "w-[300px]", height: "h-[169px]" },
  { id: "social", name: "Social Post", ratio: "1:1", width: "w-[250px]", height: "h-[250px]" },
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photo");
  const [format, setFormat] = useState("poster");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    // Mock results
    setResults([
        `https://picsum.photos/seed/${Math.random()}/400/600`,
        `https://picsum.photos/seed/${Math.random()}/400/600`,
        `https://picsum.photos/seed/${Math.random()}/400/600`,
        `https://picsum.photos/seed/${Math.random()}/400/600`,
    ]);
    setGenerating(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-[350px] flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar shrink-0">
        <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard/generators" className="p-2 hover:bg-neutral-800 rounded-full transition">
                <ArrowLeft size={20} className="text-neutral-400" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="text-primary" size={24} />
                Image Studio
            </h1>
        </div>

        {/* Prompt */}
        <div>
            <label className="block text-sm font-bold text-neutral-300 mb-2">Image Prompt</label>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition min-h-[100px] resize-none"
                placeholder="A futuristic conference poster with glowing neon typography..."
            />
        </div>

        {/* Style */}
        <div>
            <label className="block text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Palette size={14} /> Style
            </label>
            <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={clsx(
                            "p-3 rounded-lg border text-left transition-all flex items-center gap-2",
                            style === s.id ? "border-primary bg-primary/10 text-white" : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700"
                        )}
                    >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-sm font-medium">{s.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Format */}
        <div>
            <label className="block text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Layout size={14} /> Format
            </label>
            <div className="space-y-2">
                {FORMATS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={clsx(
                            "w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between group",
                            format === f.id ? "border-primary bg-primary/10" : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={clsx("border border-dashed rounded-sm border-current w-6 h-6 flex items-center justify-center text-[8px]", format===f.id ? "text-primary" : "text-neutral-500")}>
                                {f.ratio}
                            </div>
                            <span className={clsx("text-sm font-medium", format===f.id ? "text-white" : "text-neutral-400")}>{f.name}</span>
                        </div>
                        {format === f.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                ))}
            </div>
        </div>

        <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 mt-auto shadow-lg shadow-primary/20"
        >
            {generating ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles size={20} />
                    Generate Images
                </>
            )}
        </button>
      </div>

      {/* Gallery Area */}
      <div className="flex-1 bg-neutral-950 rounded-2xl border border-neutral-800 p-6 overflow-y-auto custom-scrollbar">
         {results.length > 0 ? (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {results.map((img, i) => (
                     <div key={i} className="group relative rounded-xl overflow-hidden bg-neutral-900 aspect-[2/3] border border-neutral-800 hover:border-primary transition">
                         <img src={img} alt="Generated" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-sm">
                             <button className="p-2 bg-white rounded-full text-black hover:scale-110 transition" title="Download">
                                 <Download size={16} />
                             </button>
                             <button className="p-2 bg-neutral-800 rounded-full text-white hover:scale-110 transition border border-neutral-700" title="Variations">
                                 <Layers size={16} />
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
         ) : (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                 <ImageIcon size={64} className="mb-4 text-neutral-600" />
                 <h2 className="text-2xl font-bold text-white mb-2">Image Studio</h2>
                 <p className="max-w-sm mx-auto text-neutral-400">
                    Generate professional assets for your event. 
                    Posters, banners, and social media content tailored to your brand.
                 </p>
             </div>
         )}
      </div>

    </div>
  );
}
