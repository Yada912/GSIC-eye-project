import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Sun,
  Monitor,
  Droplets,
  Eye,
  Coffee,
  Moon,
  Apple,
  Activity,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tips: string[];
  completed: boolean;
}

export function HealthGuide() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Protect from UV Rays",
      description: "Shield your eyes from harmful ultraviolet radiation",
      icon: Sun,
      tips: [
        "Wear sunglasses with 100% UV protection",
        "Choose wraparound styles for maximum coverage",
        "Wear a wide-brimmed hat outdoors",
        "Avoid direct sun during peak hours (10am-4pm)",
      ],
      completed: false,
    },
    {
      id: 2,
      title: "Manage Screen Time",
      description: "Reduce digital eye strain and fatigue",
      icon: Monitor,
      tips: [
        "Follow the 20-20-20 rule: Every 20 minutes, look 20 feet away for 20 seconds",
        "Position screen 20-26 inches from your eyes",
        "Adjust brightness to match surroundings",
        "Use blue light filters in the evening",
        "Keep screen slightly below eye level",
      ],
      completed: false,
    },
    {
      id: 3,
      title: "Stay Hydrated",
      description: "Maintain moisture for optimal eye function",
      icon: Droplets,
      tips: [
        "Drink 8-10 glasses of water daily",
        "Use a humidifier in dry environments",
        "Apply artificial tears if eyes feel dry",
        "Blink frequently, especially during screen use",
      ],
      completed: false,
    },
    {
      id: 4,
      title: "Regular Eye Exams",
      description: "Detect problems early through professional check-ups",
      icon: Eye,
      tips: [
        "Adults: Get comprehensive exam every 1-2 years",
        "Over 60: Annual exams recommended",
        "Track any vision changes between visits",
        "Inform doctor of family eye disease history",
      ],
      completed: false,
    },
    {
      id: 5,
      title: "Limit Caffeine & Alcohol",
      description: "Reduce substances that can affect eye health",
      icon: Coffee,
      tips: [
        "Limit caffeine intake, especially before bed",
        "Moderate alcohol consumption",
        "Stay hydrated when consuming these beverages",
        "Monitor how they affect your vision or comfort",
      ],
      completed: false,
    },
    {
      id: 6,
      title: "Get Quality Sleep",
      description: "Allow eyes to rest and recover",
      icon: Moon,
      tips: [
        "Aim for 7-9 hours of sleep nightly",
        "Keep bedroom dark and cool",
        "Avoid screens 1 hour before bed",
        "Use sleep mask if needed",
      ],
      completed: false,
    },
    {
      id: 7,
      title: "Eat Eye-Healthy Foods",
      description: "Nourish your eyes with the right nutrients",
      icon: Apple,
      tips: [
        "Leafy greens: spinach, kale (lutein)",
        "Fish: salmon, tuna (omega-3s)",
        "Citrus fruits (vitamin C)",
        "Carrots, sweet potatoes (beta-carotene)",
        "Nuts and seeds (vitamin E)",
      ],
      completed: false,
    },
    {
      id: 8,
      title: "Exercise Regularly",
      description: "Improve circulation for better eye health",
      icon: Activity,
      tips: [
        "30 minutes of moderate exercise daily",
        "Activities: walking, swimming, cycling",
        "Exercise helps prevent diabetes and hypertension",
        "Both conditions can affect vision",
      ],
      completed: false,
    },
  ]);

  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  const toggleComplete = (id: number) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  if (selectedStep) {
    const Icon = selectedStep.icon;
    return (
      <div className="min-h-full px-5 pt-6 pb-6 max-w-screen-sm mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedStep(null)}
            className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl">{selectedStep.title}</h1>
            <p className="text-sm text-muted-foreground">Step {selectedStep.id} of {steps.length}</p>
          </div>
        </div>

        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2>{selectedStep.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedStep.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm">How to implement:</h3>
            {selectedStep.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/50">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <button
          onClick={() => {
            toggleComplete(selectedStep.id);
            setSelectedStep(null);
          }}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white active:scale-[0.98] transition-transform"
        >
          {selectedStep.completed ? "Mark as Incomplete" : "Mark as Complete"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full px-5 pt-6 pb-6 max-w-screen-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl">Eye Health Guide</h1>
          <p className="text-sm text-muted-foreground">8 essential steps</p>
        </div>
      </div>

      {/* Progress */}
      <GlassCard className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3>Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {steps.length} steps completed
            </p>
          </div>
          <div className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </GlassCard>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <GlassCard
              key={step.id}
              onClick={() => setSelectedStep(step)}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(step.id);
                  }}
                  className="flex-shrink-0"
                >
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </button>

                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1">
                  <h4 className={step.completed ? "line-through opacity-60" : ""}>{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                <div className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {step.id}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
