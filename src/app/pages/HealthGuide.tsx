import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";

interface StepData {
  id: number;
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

interface Step extends StepData {
  completed: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun,
  Monitor,
  Droplets,
  Eye,
  Coffee,
  Moon,
  Apple,
  Activity,
};

export function HealthGuide() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved completion state from localStorage
    const savedCompletion: Record<number, boolean> = JSON.parse(
      localStorage.getItem("healthguide_completion") || "{}"
    );

    fetch("/data/healthguide.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data panduan kesehatan");
        return res.json();
      })
      .then((data: StepData[]) => {
        const stepsWithCompletion: Step[] = data.map((step) => ({
          ...step,
          completed: savedCompletion[step.id] ?? false,
        }));
        setSteps(stepsWithCompletion);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kesalahan memuat panduan kesehatan:", err);
        setError("Gagal memuat panduan kesehatan. Silakan coba lagi.");
        setLoading(false);
      });
  }, []);

  const toggleComplete = (id: number) => {
    setSteps((prev) => {
      const updated = prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      );
      // Persist completion state to localStorage
      const completion = Object.fromEntries(updated.map((s) => [s.id, s.completed]));
      localStorage.setItem("healthguide_completion", JSON.stringify(completion));
      return updated;
    });
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (selectedStep) {
    const Icon = ICON_MAP[selectedStep.icon] || Eye;
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
            <p className="text-sm text-muted-foreground">Langkah {selectedStep.id} dari {steps.length}</p>
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
            <h3 className="text-sm">Cara menerapkannya:</h3>
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
          {selectedStep.completed ? "Tandai Belum Selesai" : "Tandai Selesai"}
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
          <h1 className="text-2xl">Panduan Kesehatan Mata</h1>
          <p className="text-sm text-muted-foreground">{steps.length} langkah esensial</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Coba Lagi
          </button>
        </GlassCard>
      )}

      {!loading && !error && (
        <>
          {/* Progress */}
          <GlassCard className="p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3>Progres Anda</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount} dari {steps.length} langkah selesai
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
              const Icon = ICON_MAP[step.icon] || Eye;
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
        </>
      )}
    </div>
  );
}
