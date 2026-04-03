import { useState, useEffect } from "react";
import { X, Camera, MessageCircle, BookOpen, Eye } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("eyecare_welcome_seen");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("eyecare_welcome_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const features = [
    {
      icon: Camera,
      title: "Eye Scanner",
      description: "Quick AI analysis of your eye health",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: MessageCircle,
      title: "Chat Features",
      description: "Connect with professionals or AI assistant",
      color: "from-sky-400 to-blue-500",
    },
    {
      icon: BookOpen,
      title: "Health Guide",
      description: "8 essential steps for healthy eyes",
      color: "from-cyan-400 to-teal-400",
    },
    {
      icon: Eye,
      title: "Glossary",
      description: "Learn about eye conditions",
      color: "from-purple-400 to-pink-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/20 backdrop-blur-sm">
      <GlassCard className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl mb-2">Welcome to EyeCare</h2>
              <p className="text-sm text-muted-foreground">
                Your comprehensive eye health companion
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255, 255, 255, 0.5)" }}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="p-4 rounded-xl mb-6"
            style={{ background: "rgba(255, 255, 255, 0.5)" }}
          >
            <p className="text-xs text-center text-muted-foreground">
              📱 Optimized for mobile • 🔒 All data stored locally • 💯 100% free to use
            </p>
          </div>

          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            Get Started
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
