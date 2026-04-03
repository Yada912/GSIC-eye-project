import { useState, useRef } from "react";
import { Camera, Upload, ArrowLeft, AlertCircle, CheckCircle, Info, XCircle, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { predictEyeCondition, predictionToAnalysis } from "../../lib/model";

export function EyeScanner() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof predictionToAnalysis> | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please choose an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);

    // Small delay for UX (model loading takes a moment)
    await new Promise((r) => setTimeout(r, 800));

    try {
      const prediction = await predictEyeCondition(selectedImage);
      const analysis = predictionToAnalysis(prediction);
      setResult(analysis);
    } catch {
      setResult({
        status: "warning",
        condition: "healthy",
        confidence: 0,
        allScores: { healthy: 0, "dry-eye": 0, conjunctivitis: 0, cataract: 0, glaucoma: 0 },
        findings: ["Analysis failed. Please try a clearer image."],
        recommendations: ["Ensure good lighting when taking the photo", "Hold camera steady", "Position the eye clearly in frame"],
      });
    }

    setAnalyzing(false);
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.status === "healthy") return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (result.status === "caution") return <AlertCircle className="w-6 h-6 text-red-500" />;
    return <AlertCircle className="w-6 h-6 text-orange-500" />;
  };

  const getStatusColor = () => {
    if (!result) return "";
    if (result.status === "healthy") return "text-green-600";
    if (result.status === "caution") return "text-red-600";
    return "text-orange-600";
  };

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
          <h1 className="text-2xl">Eye Scanner</h1>
          <p className="text-sm text-muted-foreground">Capture & analyze</p>
        </div>
      </div>

      {/* Disclaimer */}
      <GlassCard className="p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          This is a preliminary screening tool. Always consult a licensed eye care professional for
          accurate diagnosis.
        </p>
      </GlassCard>

      {/* Capture / Upload Options */}
      {!selectedImage && (
        <div className="space-y-3">
          {/* Capture with Camera */}
          <GlassCard
            onClick={() => cameraInputRef.current?.click()}
            className="p-8 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Take a Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Open camera and capture your eye
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Upload from Gallery */}
          <GlassCard
            onClick={() => galleryInputRef.current?.click()}
            className="p-8 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Upload from Gallery</h3>
                <p className="text-sm text-muted-foreground">Choose a photo from your device</p>
              </div>
            </div>
          </GlassCard>

          {/* Tips card */}
          <GlassCard className="p-5">
            <div className="flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm mb-2">For best results:</h4>
                <ul className="space-y-1">
                  {[
                    "Use good, natural lighting",
                    "Hold camera steady and close to your eye",
                    "Keep eye open and look straight ahead",
                    "Ensure the entire eye is visible in frame",
                  ].map((tip, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Image Preview & Analyze */}
      {selectedImage && !result && (
        <GlassCard className="p-4 space-y-4">
          <img
            src={selectedImage}
            alt="Captured eye"
            className="w-full rounded-2xl object-cover max-h-64"
          />
          {analyzing && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <p className="text-sm text-muted-foreground">Analyzing image...</p>
            </div>
          )}
          {!analyzing && (
            <div className="flex gap-3">
              <Button
                onClick={analyzeImage}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                Analyze Image
              </Button>
              <Button onClick={reset} variant="outline" className="backdrop-blur-xl">
                Retake
              </Button>
            </div>
          )}
        </GlassCard>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <GlassCard className="p-4">
            <img
              src={selectedImage!}
              alt="Analyzed eye"
              className="w-full rounded-2xl object-cover max-h-48 mb-4"
            />
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              {getStatusIcon()}
              <div className="flex-1">
                <h3 className={`capitalize ${getStatusColor()}`}>
                  {result.condition.replace("-", " ")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {result.confidence > 0 ? `Confidence: ${result.confidence}%` : "Preliminary screening result"}
                </p>
              </div>
              {result.status !== "healthy" && (
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm mb-2">Findings:</h4>
                <ul className="space-y-1">
                  {result.findings.map((finding, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {result.status !== "healthy" && (
            <GlassCard className="p-4 border-2 border-orange-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  This screening detected potential indicators. Please consult a licensed eye care
                  professional for a proper diagnosis.
                </p>
              </div>
            </GlassCard>
          )}

          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            Scan Another Image
          </Button>
        </div>
      )}
    </div>
  );
}