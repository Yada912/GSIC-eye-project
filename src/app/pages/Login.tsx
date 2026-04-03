import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Eye, Mail, Lock, User as UserIcon } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const returnTo = (location.state as { returnTo?: string })?.returnTo || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    const user = {
      id: Date.now().toString(),
      email,
      name: isSignUp ? name : email.split("@")[0],
    };
    
    localStorage.setItem("eyecare_user", JSON.stringify(user));
    navigate(returnTo);
  };

  return (
    <div className="min-h-full px-5 pt-12 pb-6 max-w-screen-sm mx-auto flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-400/30">
              <Eye className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl mb-2">Welcome to EyeCare</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Create an account to save your chats" : "Sign in to access chat features"}
          </p>
        </div>

        {/* Form */}
        <GlassCard className="p-6 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-primary" />
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required={isSignUp}
                  className="backdrop-blur-xl border-white/50"
                  style={{ background: "rgba(255, 255, 255, 0.6)" }}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="backdrop-blur-xl border-white/50"
                style={{ background: "rgba(255, 255, 255, 0.6)" }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="backdrop-blur-xl border-white/50"
                style={{ background: "rgba(255, 255, 255, 0.6)" }}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </GlassCard>

        {/* Toggle */}
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary active:scale-95 transition-transform"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Info */}
        <GlassCard className="p-4 mt-6">
          <p className="text-xs text-center text-muted-foreground">
            Your account is only used to save chat history. No payment information is required.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
