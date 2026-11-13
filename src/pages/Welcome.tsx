import { AudioLines, ArrowRight, MicVocal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import voiceIntroductionImage from "@/assets/voice-introduction.jpg";
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative isolate flex min-h-[min(68svh,680px)] flex-col overflow-hidden bg-background">
        <img
          src={voiceIntroductionImage}
          alt="A woman speaking naturally into her phone outdoors"
          width={1440}
          height={1104}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[55%_24%]"
        />
        <div className="absolute inset-0 bg-background/45" aria-hidden="true" />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-3 px-5 py-5 sm:px-8">
          <AudioLines className="h-6 w-6 text-chip-green" aria-hidden="true" />
          <span className="text-lg font-semibold">Calibrate</span>
        </header>

        <main className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-chip-green" aria-hidden="true" />
            Voice conversations, made personal
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
            Talk, don&apos;t type.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
            Chat with ChatGPT by voice, in English or a local language. Try a quick voice setup with simple phrases to help conversations feel more like you.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => navigate("/chat")} className="gap-2">
              Start chatting
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/voice-setup")}
              className="gap-2 border-foreground/40 bg-background/30 text-foreground hover:bg-background/60"
            >
              <MicVocal aria-hidden="true" />
              Set up my voice
            </Button>
          </div>
        </main>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-chip-green">A conversation that feels more like you</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Speak naturally, in the language you use every day.
          </h2>
        </div>
        <div className="mt-8 grid gap-7 border-t border-border pt-6 sm:grid-cols-3 sm:gap-8">
          <div>
            <h3 className="font-medium">Ask out loud</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with a question and keep the conversation going by voice.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Make it personal</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Read a few everyday phrases to set up your accent and speaking style.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Choose your language</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Voice setup includes English, Hindi, Kannada, and Tamil.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;