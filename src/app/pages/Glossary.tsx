import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, AlertTriangle, Info, Shield, Eye } from "lucide-react";
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

  const conditions: Condition[] = [
    {
      id: "dry-eye",
      name: "Dry Eye Syndrome",
      category: "common",
      description:
        "A condition where eyes don't produce enough tears or tears evaporate too quickly, causing discomfort and potential vision problems.",
      symptoms: [
        "Stinging or burning sensation",
        "Scratchy or gritty feeling",
        "Excessive tearing (reflex response)",
        "Red or irritated eyes",
        "Blurred vision",
        "Eye fatigue",
      ],
      prevention: [
        "Blink frequently, especially during screen time",
        "Use a humidifier in dry environments",
        "Take regular breaks from screens",
        "Stay well-hydrated",
        "Wear wraparound sunglasses outdoors",
      ],
      detection: [
        "Self-reported symptoms",
        "Tear production test (Schirmer test)",
        "Tear quality assessment",
        "Eye surface examination",
      ],
    },
    {
      id: "cataracts",
      name: "Cataracts",
      category: "age-related",
      description:
        "Clouding of the eye's natural lens, most commonly occurring with age. Vision becomes progressively blurred, like looking through a foggy window.",
      symptoms: [
        "Cloudy or blurry vision",
        "Colors appear faded",
        "Poor night vision",
        "Halos around lights",
        "Frequent prescription changes",
        "Double vision in one eye",
      ],
      prevention: [
        "Wear UV-protective sunglasses",
        "Quit smoking",
        "Manage diabetes effectively",
        "Limit alcohol consumption",
        "Eat antioxidant-rich foods",
      ],
      detection: [
        "Comprehensive eye exam",
        "Visual acuity test",
        "Slit-lamp examination",
        "Retinal exam",
      ],
    },
    {
      id: "glaucoma",
      name: "Glaucoma",
      category: "serious",
      description:
        "A group of eye conditions that damage the optic nerve, often due to increased eye pressure. Can lead to permanent vision loss if untreated.",
      symptoms: [
        "Gradual loss of peripheral vision",
        "Tunnel vision in advanced stages",
        "Eye pain (in acute cases)",
        "Blurred vision",
        "Halos around lights",
        "Often no early symptoms",
      ],
      prevention: [
        "Regular comprehensive eye exams (crucial!)",
        "Exercise regularly",
        "Protect eyes from injury",
        "Manage blood pressure",
        "Avoid smoking",
      ],
      detection: [
        "Tonometry (eye pressure measurement)",
        "Optic nerve examination",
        "Visual field test",
        "Corneal thickness measurement",
        "Imaging tests (OCT)",
      ],
    },
    {
      id: "amd",
      name: "Age-Related Macular Degeneration",
      category: "age-related",
      description:
        "Deterioration of the macula, the central part of the retina, leading to loss of central vision. Most common cause of vision loss in people over 50.",
      symptoms: [
        "Blurred or reduced central vision",
        "Straight lines appear wavy",
        "Dark or empty areas in center of vision",
        "Difficulty recognizing faces",
        "Colors appear less vibrant",
      ],
      prevention: [
        "Don't smoke",
        "Eat leafy greens and fish",
        "Maintain healthy weight",
        "Exercise regularly",
        "Protect eyes from UV light",
        "Control blood pressure and cholesterol",
      ],
      detection: [
        "Dilated eye exam",
        "Amsler grid test",
        "Optical coherence tomography (OCT)",
        "Fluorescein angiography",
      ],
    },
    {
      id: "conjunctivitis",
      name: "Conjunctivitis (Pink Eye)",
      category: "common",
      description:
        "Inflammation of the conjunctiva (the membrane covering the white part of the eye), often caused by infection, allergies, or irritants.",
      symptoms: [
        "Pink or red color in the white of the eye",
        "Increased tearing",
        "Thick discharge that crusts over",
        "Itching or burning sensation",
        "Gritty feeling in the eye",
        "Swollen eyelids",
      ],
      prevention: [
        "Wash hands frequently",
        "Avoid touching or rubbing eyes",
        "Don't share towels or eye makeup",
        "Clean contact lenses properly",
        "Avoid known allergens",
      ],
      detection: [
        "Physical examination",
        "Medical history review",
        "Eye discharge sample (if needed)",
        "Allergy testing (for allergic conjunctivitis)",
      ],
    },
    {
      id: "diabetic-retinopathy",
      name: "Diabetic Retinopathy",
      category: "serious",
      description:
        "Damage to blood vessels in the retina caused by diabetes. Leading cause of blindness in working-age adults.",
      symptoms: [
        "Spots or floaters in vision",
        "Blurred vision",
        "Fluctuating vision",
        "Dark or empty areas in vision",
        "Vision loss",
        "Often no early symptoms",
      ],
      prevention: [
        "Control blood sugar levels",
        "Manage blood pressure and cholesterol",
        "Regular eye exams (at least annually)",
        "Maintain healthy weight",
        "Exercise regularly",
        "Don't smoke",
      ],
      detection: [
        "Dilated eye exam",
        "Fluorescein angiography",
        "Optical coherence tomography (OCT)",
        "Blood sugar monitoring",
      ],
    },
    {
      id: "astigmatism",
      name: "Astigmatism",
      category: "common",
      description:
        "An imperfection in the curvature of the cornea or lens, causing blurred or distorted vision at all distances.",
      symptoms: [
        "Blurred or distorted vision",
        "Eye strain",
        "Headaches",
        "Difficulty seeing at night",
        "Squinting to see clearly",
      ],
      prevention: [
        "Cannot be prevented (usually hereditary)",
        "Early detection through eye exams",
        "Proper correction with glasses/contacts",
      ],
      detection: [
        "Vision test",
        "Keratometry (cornea curvature measurement)",
        "Corneal topography",
        "Refraction assessment",
      ],
    },
    {
      id: "retinal-detachment",
      name: "Retinal Detachment",
      category: "serious",
      description:
        "A medical emergency where the retina pulls away from the back of the eye. Requires immediate treatment to prevent permanent vision loss.",
      symptoms: [
        "Sudden appearance of floaters",
        "Flashes of light",
        "Shadow or curtain over vision",
        "Sudden blurred vision",
        "No pain initially",
      ],
      prevention: [
        "Protect eyes from injury",
        "Regular eye exams (especially if high risk)",
        "Manage diabetes and blood pressure",
        "Seek immediate care for symptoms",
      ],
      detection: [
        "Dilated eye examination",
        "Ultrasound of the eye",
        "Ophthalmoscopy",
        "This is a MEDICAL EMERGENCY",
      ],
    },
  ];

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

      {/* Conditions List */}
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
      </div>

      {filteredConditions.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">No conditions found matching your search.</p>
        </GlassCard>
      )}
    </div>
  );
}
