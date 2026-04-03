import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, AlertTriangle, Info, Shield, Eye, Loader2 } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Input } from "../components/ui/input";

interface Condition {
  id: string;
  name: string;
  category: "common" | "serious" | "age-related";
  description: string;
  symptoms: string[];
  prevention: string[];
  detection: string[];
}

export function Glossary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/glossary.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load glossary data");
        return res.json();
      })
      .then((data: Condition[]) => {
        setConditions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading glossary:", err);
        setError("Failed to load conditions. Please try again.");
        setLoading(false);
      });
  }, []);

  const filteredConditions = conditions.filter(
    (condition) =>
      condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "serious":
        return AlertTriangle;
      case "common":
        return Info;
      case "age-related":
        return Eye;
      default:
        return Info;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "serious":
        return "from-red-400 to-orange-400";
      case "common":
        return "from-blue-400 to-cyan-400";
      case "age-related":
        return "from-purple-400 to-pink-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  if (selectedCondition) {
    const Icon = getCategoryIcon(selectedCondition.category);
    return (
      <div className="min-h-full px-5 pt-6 pb-6 max-w-screen-sm mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedCondition(null)}
            className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl">{selectedCondition.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">
              {selectedCondition.category.replace("-", " ")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Description */}
          <GlassCard className="p-5">
            <div className="flex items-start gap-4 mb-3">
              <div
                className={`p-3 rounded-2xl bg-gradient-to-br ${getCategoryColor(
                  selectedCondition.category
                )}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">What is it?</h3>
                <p className="text-sm text-muted-foreground">{selectedCondition.description}</p>
              </div>
            </div>
          </GlassCard>

          {/* Symptoms */}
          <GlassCard className="p-5">
            <h3 className="mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Symptoms
            </h3>
            <ul className="space-y-2">
              {selectedCondition.symptoms.map((symptom, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {symptom}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Prevention */}
          <GlassCard className="p-5">
            <h3 className="mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Prevention & Management
            </h3>
            <ul className="space-y-2">
              {selectedCondition.prevention.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Detection */}
          <GlassCard className="p-5">
            <h3 className="mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              How it's Detected
            </h3>
            <ul className="space-y-2">
              {selectedCondition.detection.map((method, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {method}
                </li>
              ))}
            </ul>
          </GlassCard>

          {selectedCondition.category === "serious" && (
            <GlassCard className="p-4 border-2 border-orange-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  This is a serious condition. If you experience symptoms, consult an eye care
                  professional immediately.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
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
          <h1 className="text-2xl">Eye Conditions</h1>
          <p className="text-sm text-muted-foreground">Learn about common issues</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conditions..."
            className="pl-12 backdrop-blur-xl border-white/50 rounded-2xl"
            style={{ background: "rgba(255, 255, 255, 0.7)" }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-100 text-blue-700 text-xs whitespace-nowrap">
          <Info className="w-3 h-3" />
          Common
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-100 text-red-700 text-xs whitespace-nowrap">
          <AlertTriangle className="w-3 h-3" />
          Serious
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-100 text-purple-700 text-xs whitespace-nowrap">
          <Eye className="w-3 h-3" />
          Age-Related
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Try Again
          </button>
        </GlassCard>
      )}

      {/* Conditions List */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredConditions.map((condition) => {
            const Icon = getCategoryIcon(condition.category);
            return (
              <GlassCard
                key={condition.id}
                onClick={() => setSelectedCondition(condition)}
                className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(
                      condition.category
                    )}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm">{condition.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {condition.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {filteredConditions.length === 0 && (
            <GlassCard className="p-8 text-center">
              <p className="text-muted-foreground">No conditions found matching your search.</p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
