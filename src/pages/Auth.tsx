import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        await supabase.auth.signOut();
        toast.success("Account created! Please sign in now.");
        setIsSignUp(false);
        setPassword("");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Check if voice setup is already done
        const { data: profile } = await supabase
          .from("profiles")
          .select("voice_setup_complete")
          .eq("user_id", data.user.id)
          .single();
        if (profile?.voice_setup_complete) {
          navigate("/");
        } else {
          navigate("/voice-setup");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-semibold mb-2">
          {isSignUp ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {isSignUp
            ? "Sign up to get started"
            : "Sign in to continue"}
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-accent-foreground/20 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-2xl pl-12 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-accent-foreground/20 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background rounded-2xl py-3.5 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
