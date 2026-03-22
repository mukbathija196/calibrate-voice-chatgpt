import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Check, ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ENGLISH_PHRASES = [
  "I usually start my morning with a cup of coffee and some quiet time.",
  "The weather has been really nice this week, perfect for a walk outside.",
  "I'm planning to visit my family this weekend and cook dinner together.",
];

const LOCAL_LANGUAGE_PHRASES: Record<string, { phrase: string; label: string }> = {
  hindi: {
    label: "Hindi",
    phrase: "मुझे सुबह की चाय बहुत पसंद है, यह मेरा पसंदीदा समय है।",
  },
  kannada: {
    label: "Kannada",
    phrase: "ನಾನು ಪ್ರತಿದಿನ ಸಂಜೆ ಉದ್ಯಾನವನದಲ್ಲಿ ನಡೆಯಲು ಹೋಗುತ್ತೇನೆ.",
  },
  tamil: {
    label: "Tamil",
    phrase: "நான் ஒவ்வொரு நாளும் காலையில் நடைப்பயிற்சி செல்வேன்.",
  },
};

type PhaseStatus = "pending" | "recording" | "done";
type FlowPhase = "english" | "ask-local" | "choose-language" | "local-record" | "finishing";

const VoiceSetup = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statuses, setStatuses] = useState<PhaseStatus[]>(
    ENGLISH_PHRASES.map(() => "pending")
  );
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [flowPhase, setFlowPhase] = useState<FlowPhase>("english");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [localStatus, setLocalStatus] = useState<PhaseStatus>("pending");
  const [adapting, setAdapting] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const RECORD_DURATION = 5000;

  const startRecording = useCallback(
    (onDone: () => void) => {
      setIsRecording(true);
      setProgress(0);

      const start = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.min((elapsed / RECORD_DURATION) * 100, 100));

        if (elapsed >= RECORD_DURATION) {
          clearInterval(timerRef.current!);
          setIsRecording(false);
          onDone();
        }
      }, 50);
    },
    []
  );

  const handleEnglishRecord = () => {
    setStatuses((prev) =>
      prev.map((s, i) => (i === currentIndex ? "recording" : s))
    );
    startRecording(() => {
      setStatuses((prev) =>
        prev.map((s, i) => (i === currentIndex ? "done" : s))
      );
      if (currentIndex < ENGLISH_PHRASES.length - 1) {
        setTimeout(() => setCurrentIndex((i) => i + 1), 600);
      } else {
        setTimeout(() => setFlowPhase("ask-local"), 800);
      }
    });
  };

  const handleLocalRecord = () => {
    setLocalStatus("recording");
    startRecording(() => {
      setLocalStatus("done");
      setTimeout(() => handleFinish(), 800);
    });
  };

  const handleFinish = () => {
    setAdapting(true);
    setTimeout(() => navigate("/"), 2500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const skipDialog = (
    <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
      <AlertDialogContent className="max-w-xs rounded-2xl">
        <AlertDialogDescription className="text-center text-sm text-foreground pt-2">
          You can calibrate your voice anytime from settings
        </AlertDialogDescription>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction
            onClick={() => navigate("/")}
            className="rounded-xl"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const skipButton = (
    <button
      onClick={() => setShowSkipDialog(true)}
      className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors z-10"
    >
      Skip
    </button>
  );

  if (adapting) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center px-6 gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        <p className="text-lg font-medium">Adapting to your voice...</p>
        <p className="text-sm text-muted-foreground">This will only take a moment</p>
      </div>
    );
  }

  // Ask local language screen
  if (flowPhase === "ask-local") {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground items-center justify-center px-6 gap-6">
        {skipButton}
        {skipDialog}
        <div className="flex gap-2 mb-2">
          {ENGLISH_PHRASES.map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-chip-green" />
          ))}
        </div>
        <div className="text-center space-y-3 max-w-xs">
          <Check className="w-8 h-8 text-chip-green mx-auto" />
          <h2 className="text-xl font-semibold">English calibration done!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can also speak to ChatGPT in your local language. Would you like to calibrate your voice in your local language too?
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => setFlowPhase("choose-language")}
            className="w-full bg-foreground text-background rounded-2xl px-6 py-3.5 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Yes, add a language
          </button>
          <button
            onClick={handleFinish}
            className="w-full bg-secondary text-foreground rounded-2xl px-6 py-3.5 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            No, continue
          </button>
        </div>
      </div>
    );
  }

  // Choose language screen
  if (flowPhase === "choose-language") {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground items-center justify-center px-6 gap-6">
        {skipButton}
        {skipDialog}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Choose your language</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Select the language you'd like to calibrate
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full rounded-xl bg-secondary border-0 h-12">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LOCAL_LANGUAGE_PHRASES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() => setFlowPhase("local-record")}
          disabled={!selectedLanguage}
          className="w-full max-w-xs bg-foreground text-background rounded-2xl px-6 py-3.5 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    );
  }

  // Local language recording screen
  if (flowPhase === "local-record") {
    const lang = LOCAL_LANGUAGE_PHRASES[selectedLanguage];
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground items-center justify-center px-6 gap-6">
        {skipButton}
        {skipDialog}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{lang.label} Calibration</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Read this phrase aloud so we can adapt to your speaking style
          </p>
        </div>

        <div className="w-full max-w-sm bg-secondary rounded-2xl p-6 space-y-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {lang.label} phrase
          </p>
          <p className="text-base leading-relaxed text-foreground">
            "{lang.phrase}"
          </p>
          {isRecording && (
            <div className="w-full h-1 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-chip-green rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {localStatus !== "done" ? (
          <button
            onClick={handleLocalRecord}
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
          <p className="text-xs text-chip-green flex items-center gap-1">
            <Check className="w-4 h-4" /> Phrase recorded!
          </p>
        )}

        {localStatus === "pending" && !isRecording && (
          <p className="text-xs text-muted-foreground">Tap the mic and read the phrase aloud</p>
        )}
      </div>
    );
  }

  // English recording screen (default)
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      {skipButton}
      {skipDialog}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Voice Setup</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Read {ENGLISH_PHRASES.length} short phrases so we can adapt to your accent and speaking style
          </p>
        </div>

        <div className="flex gap-2">
          {ENGLISH_PHRASES.map((_, i) => (
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

        <div className="w-full max-w-sm bg-secondary rounded-2xl p-6 space-y-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Phrase {currentIndex + 1} of {ENGLISH_PHRASES.length}
          </p>
          <p className="text-base leading-relaxed text-foreground">
            "{ENGLISH_PHRASES[currentIndex]}"
          </p>
          {isRecording && (
            <div className="w-full h-1 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-chip-green rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleEnglishRecord}
          disabled={isRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-destructive animate-pulse"
              : "bg-foreground hover:opacity-90"
          }`}
        >
          <Mic className={`w-7 h-7 ${isRecording ? "text-foreground" : "text-background"}`} />
        </button>

        {!isRecording && (
          <p className="text-xs text-muted-foreground">Tap the mic and read the phrase aloud</p>
        )}
      </div>
    </div>
  );
};

export default VoiceSetup;
