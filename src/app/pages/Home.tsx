import { useNavigate } from "react-router";
import { Camera, MessageCircle, Bot, BookOpen, Book, Sparkles, Eye } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { WelcomeDialog } from "../components/WelcomeDialog";

export function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("eyecare_user");

  const features = [
    {
      icon: Camera,
      title: "Pemindai Mata",
      description: "Analisis kesehatan mata berbasis AI",
      path: "/scanner",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: MessageCircle,
      title: "Tanya Profesional",
      description: "Ngobrol dengan ahli perawatan mata",
      path: "/professional",
      color: "from-sky-400 to-blue-500",
      requiresAuth: true,
    },
    {
      icon: Bot,
      title: "Asisten AI",
      description: "Dapatkan jawaban instan seputar kesehatan mata",
      path: "/chatbot",
      color: "from-cyan-400 to-teal-400",
      requiresAuth: true,
    },
  ];

  const resources = [
    {
      icon: BookOpen,
      title: "Panduan Kesehatan",
      description: "Tips perawatan mata langkah demi langkah",
      path: "/guide",
    },
    {
      icon: Book,
      title: "Kondisi Mata",
      description: "Pelajari masalah umum pada mata",
      path: "/glossary",
    },
  ];

  const handleFeatureClick = (path: string, requiresAuth?: boolean) => {
    if (requiresAuth && !isLoggedIn) {
      navigate("/login", { state: { returnTo: path } });
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-full px-5 pt-6 pb-6 max-w-screen-sm mx-auto">
      <WelcomeDialog />
      
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-400/30">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          EyeCare Companion
        </h1>
        <p className="text-muted-foreground">Asisten kesehatan mata pribadi Anda</p>
      </div>

      {/* Hero Card */}
      <GlassCard className="p-6 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-primary mt-1" />
            <div>
              <h2 className="text-xl mb-1">Rawat Penglihatan Anda</h2>
              <p className="text-sm text-muted-foreground">
                Pantau, pelajari, dan jaga kesehatan mata dengan alat ukur kami
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-300/20 to-transparent rounded-full blur-2xl" />
      </GlassCard>

      {/* Main Features */}
      <div className="mb-6">
        <h3 className="text-lg mb-3 px-1">Fitur Utama</h3>
        <div className="space-y-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={feature.path}
                onClick={() => handleFeatureClick(feature.path, feature.requiresAuth)}
                className="p-5 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  {feature.requiresAuth && !isLoggedIn && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Masuk
                    </span>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Resources */}
      <div className="mb-6">
        <h3 className="text-lg mb-3 px-1">Pelajari & Temukan</h3>
        <div className="grid grid-cols-2 gap-3">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <GlassCard
                key={resource.path}
                onClick={() => navigate(resource.path)}
                className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">{resource.title}</h4>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Info Banner */}
      <GlassCard className="p-4">
        <p className="text-xs text-center text-muted-foreground">
          Semua fitur gratis untuk digunakan. Fitur obrolan memerlukan akun sederhana untuk menyimpan
          percakapan Anda.
        </p>
      </GlassCard>
    </div>
  );
}