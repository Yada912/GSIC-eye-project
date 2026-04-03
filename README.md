# 👁️ GSIC Eye Health Awareness App

**Aplikasi web untuk screening dan awareness kesehatan mata menggunakan AI**

> Aplikasi ini dirancang untuk memberikan awareness tentang kondisi kesehatan mata dengan scanning berbasis kecerdasan buatan (AI) melalui integrasi TensorFlow.js dan Google Gemini API.

## 🎯 Tentang Proyek

GSIC Eye Health Awareness App adalah platform interaktif yang memungkinkan pengguna untuk:
- ✅ Melakukan screening kesehatan mata secara mandiri
- ✅ Mengidentifikasi kondisi mata umum (mata sehat, mata kering, konjungtivitis, katarak, glaukoma)
- ✅ Mendapatkan insight kesehatan mata berbasis AI
- ✅ Meningkatkan awareness tentang pentingnya kesehatan mata

⚠️ **Disclaimer**: Aplikasi ini adalah **alat screening dan edukasi saja**, bukan pengganti pemeriksaan medis profesional.

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.7.3** - Type-safe development
- **Vite 6.3.5** - Fast build tool
- **Tailwind CSS 4.1.12** - Styling utility-first
- **Radix UI** - Accessible component library
- **Material-UI (MUI)** - Design system components

### Machine Learning
- **TensorFlow.js** - Model inference di browser
- **MobileNetV2** - Pre-trained model untuk klasifikasi cepat

### AI Integration
- **Google Gemini API** - Natural language understanding & responses
- **Free tier**: 1M tokens/month (Gemini 1.5 Flash)

### Tools & Libraries
- **React Router 7.13.0** - Navigation
- **React Hook Form 7.55.0** - Form management
- **Recharts 2.15.2** - Data visualization
- **Sonner 2.0.3** - Toast notifications
- **Motion** - Smooth animations
- **Embla Carousel** - Image carousels
- **React DnD** - Drag-and-drop support

---

## 🚀 Panduan Instalasi & Menjalankan

### Prasyarat
- Node.js 18+ atau pnpm
- npm atau pnpm (package manager)
- Google Gemini API Key (gratis)

### Langkah-Langkah Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/Yada912/GSIC-eye-project.git
   cd GSIC-eye-project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau
   pnpm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Kemudian edit `.env` dan masukkan Google Gemini API Key Anda:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   **Dapatkan API Key gratis:**
   - Kunjungi: https://aistudio.google.com/app/apikey
   - Buat API key baru untuk proyek ini
   - Copy-paste ke file `.env`

4. **Jalankan Development Server**
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```
   
   Server akan berjalan di `http://localhost:5173` (atau port yang tersedia)

5. **Build untuk Production**
   ```bash
   npm run build
   # atau
   pnpm build
   ```

---

## 📁 Struktur Proyek

```
GSIC-eye-project/
├── src/                          # Source code TypeScript/React
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API & utility services
│   └── App.tsx                   # Main app component
├── public/
│   ├── model/                    # Machine learning model folder
│   │   ├── training-images/      # Training dataset
│   │   │   ├── healthy/
│   │   │   ├── dry-eye/
│   │   │   ├── conjunctivitis/
│   │   │   ├── cataract/
│   │   │   └── glaucoma/
│   │   ├── model.json            # TensorFlow.js model
│   │   └── weights.bin           # Model weights
│   └── assets/                   # Static assets
├── scripts/
│   └── train_model.py            # Model training script (Python)
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.mjs            # PostCSS configuration
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies & scripts
└── index.html                    # Entry HTML file
```

---

## 🧠 Machine Learning Model

### Tentang Model

Model ini menggunakan **MobileNetV2 dengan Transfer Learning** untuk klasifikasi kondisi mata:

- **Input**: Gambar mata 224x224 pixels (RGB)
- **Output**: 5 kategori
  - 🟢 Healthy (Mata Sehat)
  - 🔵 Dry Eye (Mata Kering)
  - 🟠 Conjunctivitis (Konjungtivitis)
  - 🟡 Cataract (Katarak)
  - 🔴 Glaucoma (Glaukoma)

### Training Model Sendiri

Jika Anda ingin melatih model dengan dataset Anda sendiri:

1. **Siapkan Lingkungan Python**
   ```bash
   pip install tensorflow pillow numpy scikit-learn tensorflowjs
   ```

2. **Kumpulkan Data Training**
   - Minimum 100 gambar per kategori (ideal 500+)
   - Spesifikasi: 224x224 pixels, JPG/PNG format
   - Gambar jernih, pencahayaan bagus, close-up mata

3. **Letakkan Gambar di Folder yang Sesuai**
   ```
   public/model/training-images/
   ├── healthy/
   ├── dry-eye/
   ├── conjunctivitis/
   ├── cataract/
   └── glaucoma/
   ```

4. **Jalankan Training Script**
   ```bash
   python scripts/train_model.py
   ```

5. **Copy Model ke Folder Public**
   - `model.json`
   - `weights.bin` (atau shard files)

### Dataset Sources (untuk pembelajaran & research)
- [Kaggle Eye Disease Datasets](https://kaggle.com)
- [STARE - Structured Analysis of the Retina](http://cecas.clemson.edu/~ahoover/stare/)
- [ORIGA Retinal Image Dataset](https://cvit.iiit.ac.in/projects/ORIGA/)
- [Messidor Dataset](http://messidor.criba.edu.ar/)
- [RIM-ONE Dataset](https://rimone.org/)

⚠️ **Pastikan Anda memiliki hak lisensi yang tepat untuk dataset yang digunakan**

---

## 📊 Features & Fitur

### Core Features
- ✅ **Eye Scanning** - Scanning kesehatan mata via kamera
- ✅ **Real-time Classification** - Hasil klasifikasi instan
- ✅ **AI Chat Assistant** - Chat dengan Gemini untuk konsultasi kesehatan
- ✅ **Health Insights** - Rekomendasi berdasarkan hasil scanning
- ✅ **Responsive Design** - Optimal di desktop, tablet, mobile

### UI/UX Features
- 🎨 Dark mode support (next-themes)
- 📱 Mobile-first responsive design
- 🎯 Accessibility first (Radix UI)
- ✨ Smooth animations (Motion)
- 📈 Data visualization (Recharts)

---

## 🔧 Development

### Useful Commands

```bash
# Development
npm run dev        # Start dev server

# Production
npm run build      # Build untuk production
npm run preview    # Preview production build

# Linting & Format (jika dikonfigurasi)
npm run lint       # Lint code
npm run format     # Format code
```

### File Penting

| File | Deskripsi |
|------|-----------|
| `.env.example` | Template environment variables |
| `vite.config.ts` | Konfigurasi Vite bundler |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS customization |
| `postcss.config.mjs` | PostCSS plugin configuration |

---

## 🌐 Deployment

### Deploy ke Vercel (Recommended)

Proyek ini sudah dikonfigurasi untuk Vercel:

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Deploy ready"
   git push origin main
   ```

2. **Connect di Vercel**
   - Kunjungi: https://vercel.com
   - Import repository GitHub Anda
   - Tambahkan environment variable: `VITE_GEMINI_API_KEY`
   - Deploy!

**Note**: Vercel akan auto-detect Vite dan build script.

---

## 📋 Environment Variables

```env
# Google Gemini API Key (Required)
VITE_GEMINI_API_KEY=sk_...your_key_here

# Optional - untuk development
VITE_API_BASE_URL=http://localhost:3000
```

---

## ⚠️ Disclaimer & Etika

### Medical Disclaimer
- 🚨 Aplikasi ini adalah **ALAT SCREENING & EDUKASI** saja
- 🚨 **BUKAN** pengganti pemeriksaan medis profesional
- 🚨 Selalu konsultasikan dengan dokter mata profesional untuk diagnosis resmi
- 🚨 Hasil klasifikasi tidak 100% akurat dan bersifat estimasi

### Data Privacy
- Model berjalan 100% di browser Anda (no data sent to our servers)
- Gambar tidak disimpan atau dikirim ke server
- Google Gemini API menerima text-only untuk chat (ikuti [kebijakan privasi Gemini](https://policies.google.com/privacy))

---

## 📚 Dokumentasi Lebih Lanjut

### Model Training
Lihat detail lengkap di: [public/model/README.md](./public/model/README.md)

### Kontribusi & Guidelines
Lihat: [guidelines/](./guidelines/)

### Attributions
Lihat credit pihak ketiga: [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)

---

## 🤝 Kontribusi

Kami menerima kontribusi! Silakan:

1. **Fork** repository ini
2. **Create branch** untuk feature Anda: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push ke branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Areas untuk Kontribusi
- 🐛 Bug fixes
- ✨ UI/UX improvements
- 📖 Documentation
- 🧪 Testing
- 🌍 Localization

---

## 📄 License

Project ini dilisensikan di bawah [lihat LICENSE file jika ada]

---

## 👤 Author & Kontak

**Yada912** - [@Yada912](https://github.com/Yada912)

---

## 🙏 Terima Kasih

Terima kasih kepada:
- TensorFlow.js team
- Google Gemini team
- React & Vite communities
- Radix UI & shadcn/ui untuk components
- Seluruh contributors

---

## 📞 Support & Issues

Menemukan bug? Ada pertanyaan?

1. **GitHub Issues**: [Buka issue baru](https://github.com/Yada912/GSIC-eye-project/issues)
2. **Discussions**: [Buka diskusi](https://github.com/Yada912/GSIC-eye-project/discussions)

---

**Made with ❤️ for eye health awareness**

Deployed at: https://eyehealthawarenessapp.vercel.app
```

---

## 📝 Catatan Penting untuk README Anda

README ini mencakup:

✅ **Deskripsi jelas** tentang proyek dan tujuannya  
✅ **Tech stack lengkap** dengan penjelasan  
✅ **Setup instructions** step-by-step  
✅ **Struktur proyek** yang mudah dipahami  
✅ **ML model documentation** untuk training sendiri  
✅ **Development guide** dan commands  
✅ **Deployment instructions** untuk Vercel  
✅ **Legal disclaimers** tentang medical use  
✅ **Contribution guidelines**  
✅ **Professional dan welcoming tone**

Anda bisa menyesuaikan bagian-bagian tertentu sesuai kebutuhan spesifik proyek Anda!
