import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Image, BarChart3, FileText, Lightbulb, Plus, Mic, AudioLines, Menu, Sparkles, UserPlus, ScanLine } from "lucide-react";

const suggestionChips = [
  { icon: Image, label: "Create image", color: "text-chip-green" },
  { icon: BarChart3, label: "Analyze data", color: "text-chip-blue" },
  { icon: FileText, label: "Summarize text", color: "text-chip-orange" },
  { icon: Lightbulb, label: "Brainstorm", color: "text-chip-yellow" },
];

const Index = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Get Plus</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Center content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <h1 className="text-2xl font-normal text-foreground">What can I help with?</h1>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {suggestionChips.map((chip) => (
            <button
              key={chip.label}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background hover:bg-secondary transition-colors"
            >
              <chip.icon className={`w-5 h-5 ${chip.color}`} />
              <span className="text-sm text-secondary-foreground">{chip.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom input */}
      <footer className="px-4 pb-6 pt-3">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-3">
          <button className="w-8 h-8 flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Ask ChatGPT"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
          />
          <button className="w-8 h-8 flex items-center justify-center">
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
            <AudioLines className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
