import { useState, useRef } from "react";
import { Camera, Upload, ArrowLeft, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";

interface AnalysisResult {
  status: "healthy" | "warning" | "caution";
  confidence: number;
  findings: string[];
  recommendations: string[];
}

export function EyeScanner() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB for performance)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please choose an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera is not supported on this device or browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      
      // Provide specific error messages based on error type
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. To enable camera access:\n\n1. Click the camera icon in your browser's address bar\n2. Change the camera setting to 'Allow'\n3. Refresh the page and try again\n\nOr simply use the Upload Image option below instead.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device. Please use the upload option instead.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("Camera is already in use by another application. Please close other apps and try again or use upload.");
      } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        setCameraError("Camera doesn't meet requirements. Please use the upload option instead.");
      } else if (err.name === "NotSupportedError") {
        setCameraError("Camera is not supported on this device. Please use the upload option instead.");
      } else if (err.name === "SecurityError") {
        setCameraError("Camera access blocked due to security settings. Please enable HTTPS or use the upload option.");
      } else {
        setCameraError("Unable to access camera. Please try the upload option instead.");
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setSelectedImage(canvas.toDataURL("image/jpeg"));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    
    // Mock analysis
    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          status: "healthy",
          confidence: 92,
          findings: ["Clear cornea", "Normal pupil response", "No visible inflammation"],
          recommendations: [
            "Continue regular eye care routine",
            "Schedule annual check-up",
            "Maintain healthy screen habits",
          ],
        },
        {
          status: "warning",
          confidence: 85,
          findings: ["Slight redness detected", "Possible eye strain indicators"],
          recommendations: [
            "Take regular breaks from screens",
            "Use lubricating eye drops",
            "Consider consulting an eye care professional",
            "Ensure proper lighting when reading",
          ],
        },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setAnalyzing(false);
    }, 2000);
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
          <p className="text-sm text-muted-foreground">AI-powered analysis</p>
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

      {/* Camera/Upload Section */}
      {!selectedImage && !cameraActive && (
        <div className="space-y-3">
          {/* Show error message if camera failed */}
          {cameraError && (
            <GlassCard className="p-5 flex items-start gap-3 bg-red-50/50 border-red-200/50">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-900 mb-2">Camera Access Issue</h4>
                <p className="text-sm text-red-700 whitespace-pre-line leading-relaxed">{cameraError}</p>
                <button
                  onClick={() => setCameraError(null)}
                  className="text-sm text-red-600 underline mt-3 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </GlassCard>
          )}

          <GlassCard
            onClick={startCamera}
            className="p-8 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Use Camera</h3>
                <p className="text-sm text-muted-foreground">
                  Take a photo with your device camera
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            onClick={() => fileInputRef.current?.click()}
            className="p-8 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Upload Image</h3>
                <p className="text-sm text-muted-foreground">Choose a photo from your gallery</p>
              </div>
            </div>
          </GlassCard>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {cameraActive && (
        <GlassCard className="p-4 space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-2xl bg-black"
          />
          <div className="flex gap-3">
            <Button
              onClick={capturePhoto}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              Capture Photo
            </Button>
            <Button onClick={stopCamera} variant="outline" className="backdrop-blur-xl">
              Cancel
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Image Preview & Analysis */}
      {selectedImage && !result && (
        <GlassCard className="p-4 space-y-4">
          <img
            src={selectedImage}
            alt="Selected eye"
            className="w-full rounded-2xl object-cover max-h-64"
          />
          <div className="flex gap-3">
            <Button
              onClick={analyzeImage}
              disabled={analyzing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              {analyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
            <Button
              onClick={() => {
                setSelectedImage(null);
                setResult(null);
              }}
              variant="outline"
              className="backdrop-blur-xl"
            >
              Retake
            </Button>
          </div>
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
              {result.status === "healthy" ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-500" />
              )}
              <div className="flex-1">
                <h3 className="capitalize">{result.status}</h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: {result.confidence}%
                </p>
              </div>
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

          <Button
            onClick={() => {
              setSelectedImage(null);
              setResult(null);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            Scan Another Image
          </Button>
        </div>
      )}
    </div>
  );
}