
"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Star, Menu, Plus, ArrowLeft, Download, Eye, Home, Calendar, User, Mail, Briefcase, Upload, Share2, Copy } from "lucide-react";
import { clsx } from "clsx";

// --- Styles Helper ---
const getThemeStyles = (theme) => ({
  primary: theme?.primary_color || "#6366F1",
  secondary: theme?.secondary_color || "#EC4899",
  background: theme?.background_color || "#ffffff",
  surface: theme?.surface_color || "#F3F4F6",
  text: theme?.text_color || "#1F2937",
  font: theme?.font_family || "sans-serif",
});

// --- Components ---

const Button = ({ props, theme, onAction }) => (
  <button
    onClick={() => onAction(props.action)}
    style={{ backgroundColor: theme.primary, color: "#fff" }}
    className={clsx(
      "py-3 px-6 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2",
      props.fullWidth ? "w-full" : "",
      props.size === "sm" ? "text-xs py-2 px-4" : ""
    )}
  >
    {props.icon === "upload" && <Upload size={16} />}
    {props.text}
  </button>
);

const TextField = ({ id, props, theme, value, onChange }) => (
  <div className="mb-4 w-full">
    {props.label && (
        <label className="block text-sm font-medium mb-1 opacity-80" style={{ color: theme.text }}>
            {props.label}
        </label>
    )}
    {props.multiline ? (
        <textarea
            value={value || ""}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={props.hint}
            rows={4}
            style={{ 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: theme.text + "20"
            }}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-opacity-50 outline-none transition resize-none"
        />
    ) : (
        <input
            type={props.obscure ? "password" : "text"}
            value={value || ""}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={props.hint}
            style={{ 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: theme.text + "20"
            }}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-opacity-50 outline-none transition"
        />
    )}
  </div>
);

const HeroImage = ({ props }) => (
  <div className="w-full h-48 sm:h-64 mb-4 rounded-xl overflow-hidden bg-gray-200 relative group">
    <img src={props.url} alt="Hero" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
        Change Image
    </div>
  </div>
);

const ListTile = ({ props, theme, onAction }) => (
  <div 
    onClick={() => onAction(props.action)}
    style={{ backgroundColor: theme.surface }}
    className="p-4 mb-3 rounded-xl flex items-center justify-between cursor-pointer active:scale-[0.99] transition"
  >
    <div className="flex items-center gap-4">
        <div style={{ color: theme.primary }} className="bg-white/10 p-2 rounded-full">
            <Star size={20} />
        </div>
        <div>
            <h3 style={{ color: theme.text }} className="font-semibold">{props.title}</h3>
            <p style={{ color: theme.text }} className="text-sm opacity-70">{props.subtitle}</p>
        </div>
    </div>
    <ChevronRight size={20} style={{ color: theme.text, opacity: 0.5 }} />
  </div>
);

const AppBar = ({ props, theme, canGoBack, onBack }) => (
  <div 
    style={{ backgroundColor: theme.surface, color: theme.text }}
    className="h-14 px-4 flex items-center shadow-sm mb-4 sticky top-0 z-10"
  >
    {canGoBack ? (
        <button onClick={onBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={20} />
        </button>
    ) : (
        <div className="w-4" /> 
    )}
    <h1 className={clsx("font-bold text-lg flex-1", props.centered && "text-center pr-8")}>
        {props.title}
    </h1>
  </div>
);

const Divider = ({theme}) => (
    <div className="h-px w-full my-6" style={{backgroundColor: theme.text, opacity: 0.1}} />
);

// Only supporting simple layouts for now as 'Container' children
const RenderChildren = (children, theme, actions, formData, handleInputChange) => {
    if (!children) return null;
    return children.map((comp, idx) => (
        <ComponentDispatch key={idx} comp={comp} theme={theme} actions={actions} formData={formData} handleInputChange={handleInputChange} />
    ));
};

// Component Dispatcher to handle recursion
const ComponentDispatch = ({ comp, theme, actions, formData, handleInputChange }) => {
    switch (comp.type) {
        case "app_bar": return null; // Handled separately in Renderer layout
        case "text":
            return (
                <p style={{ 
                    fontSize: comp.props.fontSize || 16, 
                    fontWeight: comp.props.fontWeight || "normal",
                    color: comp.props.color || theme.text,
                    marginBottom: 8
                }}>
                    {comp.props.text}
                </p>
            );
        case "button":
            return <div className="mb-4"><Button props={comp.props} theme={theme} onAction={actions} /></div>;
        case "text_field":
            return <TextField id={comp.id} props={comp.props} theme={theme} value={formData[comp.id]} onChange={handleInputChange} />;
        case "image": 
        case "hero":
            return <HeroImage props={comp.props} />;
        case "list_tile": return <ListTile props={comp.props} theme={theme} onAction={actions} />;
        case "divider": return <Divider theme={theme} />;
        
        // Layouts
        case "row":
            return (
                <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {RenderChildren(comp.children, theme, actions, formData, handleInputChange)}
                </div>
            );
        case "grid":
             return (
                <div className="grid gap-3 mb-4" style={{gridTemplateColumns: `repeat(${comp.props.columns || 2}, 1fr)`}}>
                    {RenderChildren(comp.children, theme, actions, formData, handleInputChange)}
                </div>
            );
        case "container":
            return (
                <div className="rounded-xl overflow-hidden mb-4" style={{padding: comp.props.padding || 16, backgroundColor: comp.props.color || theme.surface}}>
                    {RenderChildren(comp.children, theme, actions, formData, handleInputChange)}
                </div>
            );
            
        default:
            return <div className="text-xs text-red-400 p-2 border border-red-400 rounded">Unknown: {comp.type}</div>;
    }
};

// --- Main Renderer ---

export default function Renderer({ initialConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [currentScreenId, setCurrentScreenId] = useState("welcome"); 
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
      // Logic to find entry screen
      if (initialConfig.screens && initialConfig.screens.length > 0) {
          const first = initialConfig.screens[0].id;
          // If we haven't set a screen yet or current is invalid
          if (history.length === 0) {
              setCurrentScreenId(first);
              setHistory([first]);
          }
      }
      setConfig(initialConfig);
  }, [initialConfig]);

  const theme = getThemeStyles(config.theme);
  const currentScreen = config.screens.find((s) => s.id === currentScreenId) || config.screens[0];

  const handleNavigate = (targetId) => {
      setHistory([...history, targetId]);
      setCurrentScreenId(targetId);
  };

  const handleBack = () => {
      if (history.length > 1) {
          const newHistory = [...history];
          newHistory.pop();
          setHistory(newHistory);
          setCurrentScreenId(newHistory[newHistory.length - 1]);
      }
  };

  const handleAction = (actionStr) => {
      if (!actionStr) return;
      const [type, arg] = actionStr.split(":");
      
      if (type === "navigate") handleNavigate(arg);
      else if (type === "go_back") handleBack();
      else if (type === "save_form") {
          alert(`Form Saved! (Mock)\nTop-level Fields: ${JSON.stringify(formData)}`);
      }
      else if (type === "ai") {
          // Mock AI generation
          if (arg === "generate_announcement") {
             setFormData(prev => ({...prev, output: "🔥 TECHFEST 2026 IS HERE! 🔥\n\nJoin us at the Main Auditorium tomorrow @ 10AM.\nFree T-shirts, Pizza, and Coding!\n\n#TechFest #Hackathon"}));
          } else {
             alert("AI Action triggered: " + arg);
          }
      }
      else if (type === "copy") {
          alert("Copied to clipboard!");
      }
  };

  const handleInputChange = (id, value) => {
      setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (!currentScreen) return <div className="p-8 text-center text-red-500">Screen not found</div>;

  // Find App Bar in current screen components
  const appBarComp = currentScreen.components.find(c => c.type === "app_bar");

  return (
    <div 
        style={{ backgroundColor: theme.background, fontFamily: theme.font }}
        className="w-full h-full min-h-[600px] overflow-y-auto relative no-scrollbar"
    >
      {/* App Bar (Fixed at top of renderer logic, but inside scroll for simplicity in mock) */}
      {appBarComp && <AppBar props={appBarComp.props} theme={theme} canGoBack={history.length > 1} onBack={handleBack} />}

      {/* Dynamic Content */}
      <div className="p-4 pt-0 min-h-full pb-20">
         {currentScreen.components.map((comp, idx) => (
             <ComponentDispatch 
                key={idx} 
                comp={comp} 
                theme={theme} 
                actions={handleAction} 
                formData={formData} 
                handleInputChange={handleInputChange} 
             />
         ))}
      </div>
      
      {/* Bottom Nav Simulation (Optional) */}
    </div>
  );
}
