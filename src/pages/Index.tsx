import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, BarChart3, FileText, Lightbulb, Plus, Mic, AudioLines, Menu, Sparkles, UserPlus, ScanLine, X, ArrowUp, MoreVertical, Minus, Info, MicVocal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { hasCompletedVoiceSetup } from "@/lib/voice-setup";

const suggestionChips = [
  { icon: Image, label: "Create image", color: "text-chip-green" },
  { icon: BarChart3, label: "Analyze data", color: "text-chip-blue" },
  { icon: FileText, label: "Summarize text", color: "text-chip-orange" },
  { icon: Lightbulb, label: "Brainstorm", color: "text-chip-yellow" },
  { icon: Mic, label: "Ask by voice, not by keyboard", color: "text-chip-purple" },
  { icon: AudioLines, label: "Learn better through conversations", color: "text-chip-pink" },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([]);
  const [voiceSetupComplete] = useState(hasCompletedVoiceSetup);
  const navigate = useNavigate();

  useEffect(() => {
    if (!voiceActive) return;
    const interval = setInterval(() => {
      setWaveHeights(Array.from({ length: 30 }, () => Math.random() * 24 + 4));
    }, 150);
    return () => clearInterval(interval);
  }, [voiceActive]);

  if (conversationMode) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConversationMode(false)}
              className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
            >
              <Minus className="w-5 h-5 text-zinc-400" />
            </button>
            <span className="text-base font-semibold text-white">ChatGPT</span>
            <span className="text-base text-zinc-400">Voice</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 absolute top-3 right-14" />
            <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <MoreVertical className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </header>

        {/* Center */}
        <main className="flex-1 flex items-center justify-center">
          <h1 className="text-3xl font-light text-zinc-400">Start talking</h1>
        </main>

        {/* Bottom bar */}
        <footer className="px-4 pb-6 pt-3">
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <Plus className="w-5 h-5 text-zinc-400" />
            </button>
            <div className="flex-1 bg-zinc-800 rounded-full px-4 py-3">
              <input
                type="text"
                placeholder="Type"
                className="w-full bg-transparent text-white placeholder:text-zinc-500 outline-none text-base"
              />
            </div>
            <button className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
              <Mic className="w-5 h-5 text-zinc-300" />
            </button>
            <button
              onClick={() => setConversationMode(false)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600"
            >
              <AudioLines className="w-5 h-5 text-white" />
              <span className="text-white font-medium">End</span>
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-card border-border flex flex-col p-0">
              <div className="flex-1 pt-12 px-4 space-y-2">
                <button
                  onClick={() => navigate("/voice-setup")}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-foreground"
                >
                  <MicVocal className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Set up your voice</span>
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-foreground"
                >
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">About Calibrate</span>
                </button>
              </div>
              <div className="px-4 py-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {voiceSetupComplete ? "Voice setup complete on this device" : "Voice setup is available anytime"}
                </p>
              </div>
            </SheetContent>
          </Sheet>
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
              onClick={() => {
                if (chip.label === "Ask by voice, not by keyboard") setVoiceActive(true);
                if (chip.label === "Learn better through conversations") setConversationMode(true);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background hover:bg-secondary transition-colors"
            >
              <chip.icon className={`w-5 h-5 shrink-0 ${chip.color}`} />
              <span className="text-sm text-secondary-foreground">{chip.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom input */}
      <footer className="px-4 pb-6 pt-3">
        {voiceActive ? (
          <div className="space-y-2">
            <div className="bg-secondary rounded-3xl px-5 pt-6 pb-4 flex flex-col items-end gap-4">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                See text
              </button>
              <div className="flex items-end gap-[3px] w-full justify-center h-8">
                {waveHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-muted-foreground transition-all duration-150"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => setVoiceActive(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1" />
              <button className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                <ArrowUp className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>
        ) : (
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
            <button
              onClick={() => setVoiceActive(true)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setConversationMode(true)}
              className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center"
            >
              <AudioLines className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Index;
