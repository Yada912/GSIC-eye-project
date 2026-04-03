import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Lock,
  Shield,
  Users,
  BookOpen,
  Book,
  Bot,
  ImageIcon,
  Download,
  Trash2,
  Plus,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Database,
  Settings,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ADMIN_PASSWORD = "eyecare_admin_2024";
const ADMIN_SESSION_KEY = "eyecare_admin_session";

// ─── Types ────────────────────────────────────────────────────────
interface GlossaryCondition {
  id: string;
  name: string;
  category: "common" | "serious" | "age-related";
  description: string;
  symptoms: string[];
  prevention: string[];
  detection: string[];
}

interface HealthGuideStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

type AdminSection = "dashboard" | "glossary" | "guide" | "chatbot" | "model" | "users" | "settings";

// ─── Login Screen ─────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      onLogin();
    } else {
      setError("Kata sandi salah. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl mb-1">Panel Admin</h1>
          <p className="text-sm text-muted-foreground">Manajemen Aplikasi EyeCare</p>
        </div>

        <GlassCard className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Kata Sandi Admin</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Masukkan kata sandi admin"
                className="pl-10 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <Button
            onClick={handleLogin}
            disabled={!password || loading}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white"
          >
            {loading ? "Memverifikasi..." : "Akses Panel Admin"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Kata sandi bawaan: <code className="bg-gray-100 px-1 rounded">eyecare_admin_2024</code>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────
function Dashboard({
  onNavigate,
  glossaryCount,
  guideCount,
  userCount,
}: {
  onNavigate: (s: AdminSection) => void;
  glossaryCount: number;
  guideCount: number;
  userCount: number;
}) {
  const stats = [
    { label: "Kondisi Mata", value: glossaryCount, icon: Book, color: "from-blue-400 to-cyan-400", section: "glossary" as AdminSection },
    { label: "Langkah Panduan", value: guideCount, icon: BookOpen, color: "from-green-400 to-emerald-400", section: "guide" as AdminSection },
    { label: "Pengguna", value: userCount, icon: Users, color: "from-purple-400 to-pink-400", section: "users" as AdminSection },
  ];

  const actions = [
    { label: "Kelola Glosarium", icon: Book, section: "glossary" as AdminSection, desc: "Tambah / edit / hapus kondisi" },
    { label: "Kelola Panduan", icon: BookOpen, section: "guide" as AdminSection, desc: "Edit langkah panduan kesehatan" },
    { label: "Memori Chatbot", icon: Bot, section: "chatbot" as AdminSection, desc: "Lihat file basis pengetahuan" },
    { label: "Pelatihan Model", icon: ImageIcon, section: "model" as AdminSection, desc: "Kategori gambar pelatihan AI" },
    { label: "Manajemen Pengguna", icon: Users, section: "users" as AdminSection, desc: "Lihat akun terdaftar" },
    { label: "Pengaturan", icon: Settings, section: "settings" as AdminSection, desc: "Konfigurasi aplikasi" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg mb-1">Dasbor</h2>
        <p className="text-sm text-muted-foreground">Ringkasan aplikasi EyeCare Companion Anda</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={stat.label}
              onClick={() => onNavigate(stat.section)}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-2 w-fit`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          );
        })}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm text-muted-foreground px-1">Aksi Cepat</h3>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <GlassCard
              key={action.section}
              onClick={() => onNavigate(action.section)}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── Glossary Manager ─────────────────────────────────────────────
function GlossaryManager() {
  const [conditions, setConditions] = useState<GlossaryCondition[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCondition, setNewCondition] = useState<Partial<GlossaryCondition>>({
    category: "common",
    symptoms: [],
    prevention: [],
    detection: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/glossary.json")
      .then((r) => r.json())
      .then((data) => { setConditions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(conditions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glossary.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteCondition = (id: string) => {
    if (confirm("Hapus kondisi ini?")) {
      setConditions((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const addCondition = () => {
    if (!newCondition.name || !newCondition.description) {
      alert("Nama dan deskripsi wajib diisi.");
      return;
    }
    const condition: GlossaryCondition = {
      id: newCondition.name!.toLowerCase().replace(/\s+/g, "-"),
      name: newCondition.name!,
      category: newCondition.category as "common" | "serious" | "age-related",
      description: newCondition.description!,
      symptoms: newCondition.symptoms || [],
      prevention: newCondition.prevention || [],
      detection: newCondition.detection || [],
    };
    setConditions((prev) => [...prev, condition]);
    setNewCondition({ category: "common", symptoms: [], prevention: [], detection: [] });
    setShowAddForm(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Memuat...</div>;

  const categoryColors: Record<string, string> = {
    common: "bg-blue-100 text-blue-700",
    serious: "bg-red-100 text-red-700",
    "age-related": "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg">Kelola Glosarium</h2>
          <p className="text-sm text-muted-foreground">{conditions.length} kondisi</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadJSON} variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" />
            Ekspor
          </Button>
          <Button onClick={() => setShowAddForm(true)} size="sm" className="gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <Plus className="w-4 h-4" />
            Tambah
          </Button>
        </div>
      </div>

      {/* Reminder banner */}
      <GlassCard className="p-3 flex items-start gap-2 bg-amber-50/50">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Setelah mengedit, klik <strong>Ekspor</strong> dan timpa file <code>public/data/glossary.json</code> dalam proyek agar perubahan menjadi permanen.
        </p>
      </GlassCard>

      {/* Add Form */}
      {showAddForm && (
        <GlassCard className="p-5 space-y-3 border-2 border-blue-200">
          <h3 className="text-sm font-medium">Tambah Kondisi Baru</h3>
          <Input
            placeholder="Nama kondisi"
            value={newCondition.name || ""}
            onChange={(e) => setNewCondition((p) => ({ ...p, name: e.target.value }))}
          />
          <select
            value={newCondition.category}
            onChange={(e) => setNewCondition((p) => ({ ...p, category: e.target.value as any }))}
            className="w-full px-3 py-2 rounded-xl border text-sm bg-white/70"
          >
            <option value="common">Umum (Common)</option>
            <option value="serious">Serius (Serious)</option>
            <option value="age-related">Terkait Usia (Age-Related)</option>
          </select>
          <textarea
            placeholder="Deskripsi"
            value={newCondition.description || ""}
            onChange={(e) => setNewCondition((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border text-sm bg-white/70 resize-none"
          />
          <div className="flex gap-2">
            <Button onClick={addCondition} size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <Save className="w-4 h-4 mr-1" /> Simpan
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Conditions List */}
      <div className="space-y-2">
        {conditions.map((condition) => (
          <GlassCard key={condition.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{condition.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[condition.category]}`}>
                    {condition.category === "common" ? "Umum" : condition.category === "serious" ? "Serius" : "Terkait Usia"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{condition.description}</p>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{condition.symptoms.length} gejala</span>
                  <span>{condition.prevention.length} tips pencegahan</span>
                </div>
              </div>
              <button
                onClick={() => deleteCondition(condition.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── Health Guide Manager ─────────────────────────────────────────
function GuideManager() {
  const [steps, setSteps] = useState<HealthGuideStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/healthguide.json")
      .then((r) => r.json())
      .then((data) => { setSteps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(steps, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "healthguide.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Memuat...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg">Kelola Panduan Kesehatan</h2>
          <p className="text-sm text-muted-foreground">{steps.length} langkah</p>
        </div>
        <Button onClick={downloadJSON} variant="outline" size="sm" className="gap-1">
          <Download className="w-4 h-4" />
          Ekspor
        </Button>
      </div>

      <GlassCard className="p-3 flex items-start gap-2 bg-amber-50/50">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Ekspor dan timpa file <code>public/data/healthguide.json</code> untuk menyimpan perubahan secara permanen.
        </p>
      </GlassCard>

      <div className="space-y-2">
        {steps.map((step) => (
          <GlassCard key={step.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {step.id}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-0.5">{step.title}</div>
                <div className="text-xs text-muted-foreground mb-1">{step.description}</div>
                <div className="text-xs text-muted-foreground">{step.tips.length} tips • ikon: {step.icon}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── Chatbot Memory Viewer ────────────────────────────────────────
function ChatbotMemoryViewer() {
  const [activeFile, setActiveFile] = useState<string>("eye_conditions.txt");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const files = [
    { name: "eye_conditions.txt", label: "Kondisi Mata" },
    { name: "general_tips.txt", label: "Tips Umum" },
    { name: "faq.txt", label: "FAQ" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/chatbot-memory/${activeFile}`)
      .then((r) => r.text())
      .then((text) => { setContent(text); setLoading(false); })
      .catch(() => { setContent("Gagal memuat file."); setLoading(false); });
  }, [activeFile]);

  const downloadFile = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg">Memori Chatbot</h2>
          <p className="text-sm text-muted-foreground">File basis pengetahuan</p>
        </div>
        <Button onClick={downloadFile} variant="outline" size="sm" className="gap-1">
          <Download className="w-4 h-4" />
          Unduh
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={`text-xs px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeFile === file.name
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-white/60 text-muted-foreground hover:bg-white/80"
            }`}
          >
            {file.label}
          </button>
        ))}
      </div>

      <GlassCard className="p-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Memuat...</div>
        ) : (
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {content}
          </pre>
        )}
      </GlassCard>

      <GlassCard className="p-3 flex items-start gap-2 bg-blue-50/50">
        <Database className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Untuk memperbarui basis pengetahuan, edit file di <code>public/chatbot-memory/</code> lalu deploy ulang. Chatbot AI memuat file ini sebagai konteks saat diinisialisasi.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── Model Training Section ───────────────────────────────────────
function ModelSection() {
  const categories = [
    { name: "healthy", color: "from-green-400 to-emerald-400", desc: "Mata normal, sehat" },
    { name: "dry-eye", color: "from-sky-400 to-blue-400", desc: "Indikator sindrom mata kering" },
    { name: "conjunctivitis", color: "from-red-400 to-orange-400", desc: "Mata merah / konjungtivitis" },
    { name: "cataract", color: "from-yellow-400 to-amber-400", desc: "Kekeruhan lensa / katarak" },
    { name: "glaucoma", color: "from-purple-400 to-violet-400", desc: "Tanda saraf optik / glaukoma" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg">Pelatihan Model</h2>
        <p className="text-sm text-muted-foreground">Kategori gambar pelatihan</p>
      </div>

      <GlassCard className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <h3 className="text-sm font-medium mb-2">Alur Pelatihan (Workflow)</h3>
        <ol className="space-y-2">
          {[
            "Posisikan gambar di folder kategori di bawah",
            "Jalankan skrip: python scripts/train_model.py",
            "Salin file model.json + bobot yang dihasilkan ke folder public/model/",
            "Deploy ulang aplikasi — pemindai akan memakai model tersebut otomatis",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </GlassCard>

      <div className="space-y-2">
        {categories.map((cat) => (
          <GlassCard key={cat.name} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${cat.color}`}>
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium capitalize">{cat.name.replace("-", " ")}</div>
                <div className="text-xs text-muted-foreground">{cat.desc}</div>
                <div className="text-xs text-blue-600 mt-0.5">
                  public/model/training-images/{cat.name}/
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-4">
        <h3 className="text-sm font-medium mb-2">Syarat Instalasi</h3>
        <pre className="text-xs text-muted-foreground bg-slate-900 text-green-400 p-3 rounded-xl overflow-x-auto">
          {`pip install tensorflow pillow numpy tensorflowjs\npython scripts/train_model.py`}
        </pre>
      </GlassCard>
    </div>
  );
}

// ─── User Management ──────────────────────────────────────────────
function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Gather all users from localStorage
    const usersList: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === "eyecare_user") {
        try {
          const user = JSON.parse(localStorage.getItem(key) || "{}");
          usersList.push(user);
        } catch {}
      }
    }
    setUsers(usersList);
  }, []);

  const clearChatHistory = () => {
    if (confirm("Hapus seluruh riwayat percakapan? Ini tak dapat dikembalikan.")) {
      localStorage.removeItem("chatbot_messages");
      alert("Riwayat obrolan telah dihapus.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg">Manajemen Pengguna</h2>
        <p className="text-sm text-muted-foreground">Akun terdaftar</p>
      </div>

      {users.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada user yang teregistrasi di sesi browser saat ini.</p>
          <p className="text-xs text-muted-foreground mt-1">Pengguna disimpan dalam localStorage peramban.</p>
        </GlassCard>
      ) : (
        users.map((user, i) => (
          <GlassCard key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.name || "Anonim"}</div>
                <div className="text-xs text-muted-foreground">{user.email || "Tanpa email"}</div>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </GlassCard>
        ))
      )}

      <GlassCard className="p-4 space-y-3">
        <h3 className="text-sm font-medium">Pengelolaan Data</h3>
        <button
          onClick={clearChatHistory}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left"
        >
          <div className="p-2 rounded-xl bg-red-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <div className="text-sm text-red-600">Hapus Riwayat Chat</div>
            <div className="text-xs text-muted-foreground">Menghapus semua obrolan dengan chatbot AI</div>
          </div>
        </button>
      </GlassCard>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────
function SettingsSection() {
  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  const modelPresent = false; // Can be enhanced to actually check

  const items = [
    {
      label: "API Gemini",
      desc: hasApiKey ? "Kunci API telah terkonfigurasi ✓" : "Belum dikonfigurasi — atur VITE_GEMINI_API_KEY di .env",
      status: hasApiKey,
      icon: Bot,
    },
    {
      label: "Figma Make Sync",
      desc: "Terhubung lewat repositori GitHub (Yada912/Eyehealthawarenessapp)",
      status: true,
      icon: Edit3,
    },
    {
      label: "AI Model",
      desc: modelPresent ? "Model termuat (public/model/model.json)" : "Belum ada model terlatih — menggunakan analisis pura-pura (mock)",
      status: modelPresent,
      icon: ImageIcon,
    },
    {
      label: "Deployment Vercel",
      desc: "Deployment otomatis ketika push ke main",
      status: true,
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg">Pengaturan Aplikasi</h2>
        <p className="text-sm text-muted-foreground">Status konfigurasi</p>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <GlassCard key={item.label} className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                {item.status ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-4 space-y-2">
        <h3 className="text-sm font-medium">Variabel Lingkungan (Environment)</h3>
        <pre className="text-xs text-muted-foreground bg-slate-900 text-green-400 p-3 rounded-xl overflow-x-auto">
{`# file .env (pada root folder)
VITE_GEMINI_API_KEY=kunci_api_gemini_anda

# Dapatkan kunci gratis di:
# https://aistudio.google.com/app/apikey`}
        </pre>
      </GlassCard>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────
export function Admin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState<AdminSection>("dashboard");
  const [glossaryCount, setGlossaryCount] = useState(0);
  const [guideCount, setGuideCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetch("/data/glossary.json").then((r) => r.json()).then((d) => setGlossaryCount(d.length)).catch(() => {});
      fetch("/data/healthguide.json").then((r) => r.json()).then((d) => setGuideCount(d.length)).catch(() => {});
      const user = localStorage.getItem("eyecare_user");
      setUserCount(user ? 1 : 0);
    }
  }, [authenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const sectionTitles: Record<AdminSection, string> = {
    dashboard: "Dasbor",
    glossary: "Glosarium",
    guide: "Panduan Kesehatan",
    chatbot: "Memori Chatbot",
    model: "Pelatihan Model",
    users: "Pengguna",
    settings: "Pengaturan",
  };

  return (
    <div className="min-h-full max-w-screen-sm mx-auto">
      {/* Admin Header */}
      <div
        className="sticky top-0 z-10 px-5 py-4 backdrop-blur-xl border-b border-white/50"
        style={{ background: "rgba(255, 255, 255, 0.85)" }}
      >
        <div className="flex items-center gap-3">
          {currentSection !== "dashboard" && (
            <button
               onClick={() => setCurrentSection("dashboard")}
              className="p-2 rounded-xl hover:bg-white/50 active:scale-95 transition-all"
            >
              <Shield className="w-5 h-5 text-slate-600" />
            </button>
          )}
          {currentSection === "dashboard" && (
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-base font-semibold">
              Panel Admin {currentSection !== "dashboard" && `/ ${sectionTitles[currentSection]}`}
            </h1>
          </div>
          <button
             onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
            title="Keluar / Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        {currentSection === "dashboard" && (
          <Dashboard
             onNavigate={setCurrentSection}
            glossaryCount={glossaryCount}
            guideCount={guideCount}
            userCount={userCount}
          />
        )}
        {currentSection === "glossary" && <GlossaryManager />}
        {currentSection === "guide" && <GuideManager />}
        {currentSection === "chatbot" && <ChatbotMemoryViewer />}
        {currentSection === "model" && <ModelSection />}
        {currentSection === "users" && <UserManagement />}
        {currentSection === "settings" && <SettingsSection />}
      </div>
    </div>
  );
}
