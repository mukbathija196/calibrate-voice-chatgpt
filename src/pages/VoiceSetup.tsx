import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Check, ArrowRight } from "lucide-react";

const SAMPLE_PHRASES = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "She sells seashells by the seashore every sunny Saturday morning.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
];

type PhaseStatus = "pending" | "recording" | "done";

const VoiceSetup = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statuses, setStatuses] = useState<PhaseStatus[]>(
    SAMPLE_PHRASES.map(() => "pending")
  );
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [adapting, setAdapting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const RECORD_DURATION = 5000; // 5 seconds per phrase

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setProgress(0);
    setStatuses((prev) =>
      prev.map((s, i) => (i === currentIndex ? "recording" : s))
    );

    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / RECORD_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= RECORD_DURATION) {
        clearInterval(timerRef.current!);
        setIsRecording(false);
        setStatuses((prev) =>
          prev.map((s, i) => (i === currentIndex ? "done" : s))
        );

        if (currentIndex < SAMPLE_PHRASES.length - 1) {
          setTimeout(() => setCurrentIndex((i) => i + 1), 600);
        } else {
          setAllDone(true);
        }
      }
    }, 50);
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFinish = () => {
    setAdapting(true);
    setTimeout(() => navigate("/"), 2500);
  };

  if (adapting) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center px-6 gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        <p className="text-lg font-medium">Adapting to your voice...</p>
        <p className="text-sm text-muted-foreground">This will only take a moment</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Voice Setup</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Read {SAMPLE_PHRASES.length} short phrases so we can adapt to your accent and speaking style
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {SAMPLE_PHRASES.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                statuses[i] === "done"
                  ? "bg-chip-green"
                  : i === currentIndex
                  ? "bg-foreground"
                  : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Phrase card */}
        <div className="w-full max-w-sm bg-secondary rounded-2xl p-6 space-y-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Phrase {currentIndex + 1} of {SAMPLE_PHRASES.length}
          </p>
          <p className="text-base leading-relaxed text-foreground">
            "{SAMPLE_PHRASES[currentIndex]}"
          </p>

          {/* Progress bar */}
          {isRecording && (
            <div className="w-full h-1 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-chip-green rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Record button */}
        {!allDone ? (
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-destructive animate-pulse"
                : "bg-foreground hover:opacity-90"
            }`}
          >
            <Mic className={`w-7 h-7 ${isRecording ? "text-foreground" : "text-background"}`} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 bg-foreground text-background rounded-2xl px-8 py-3.5 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {!allDone && !isRecording && (
          <p className="text-xs text-muted-foreground">Tap the mic and read the phrase aloud</p>
        )}
        {allDone && (
          <p className="text-xs text-chip-green flex items-center gap-1">
            <Check className="w-4 h-4" /> All phrases recorded!
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceSetup;
