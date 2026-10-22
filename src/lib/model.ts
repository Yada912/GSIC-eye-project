/**
 * Eye Condition Classification Model
 *
 * Currently uses mock analysis for development/demo mode.
 *
 * To enable real AI analysis:
 * 1. Train your model: python scripts/train_model.py
 * 2. Copy model.json + weights to public/model/
 * 3. Install TF.js: npm install @tensorflow/tfjs
 * 4. Uncomment the loadTFModel() function below and enable it in predictEyeCondition()
 */

export type EyeCondition = "healthy" | "dry-eye" | "conjunctivitis" | "cataract" | "glaucoma";

export interface ModelPrediction {
  condition: EyeCondition;
  confidence: number;
  allScores: Record<EyeCondition, number>;
  usedMockModel: boolean;
}

export interface AnalysisResult {
  status: "healthy" | "warning" | "caution";
  condition: EyeCondition;
  confidence: number;
  findings: string[];
  recommendations: string[];
  allScores: Record<EyeCondition, number>;
}

const CATEGORIES: EyeCondition[] = [
  "healthy",
  "dry-eye",
  "conjunctivitis",
  "cataract",
  "glaucoma",
];

export async function predictEyeCondition(
  imageDataUrl: string
): Promise<ModelPrediction> {
  // Simulate processing time
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

  return generateMockPrediction();
}

function generateMockPrediction(): ModelPrediction {
  const weights = [0.50, 0.22, 0.14, 0.09, 0.05];
  const rand = Math.random();
  let cumulative = 0;
  let topIndex = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      topIndex = i;
      break;
    }
  }

  const confidence = Math.floor(76 + Math.random() * 19); 
  const topCondition = CATEGORIES[topIndex];
  const remaining = (1 - confidence / 100) / (CATEGORIES.length - 1);

  const allScores = Object.fromEntries(
    CATEGORIES.map((cat, i) => [
      cat,
      i === topIndex
        ? Math.round(confidence) / 100
        : Math.round(remaining * 100) / 100,
    ])
  ) as Record<EyeCondition, number>;

  return {
    condition: topCondition,
    confidence,
    allScores,
    usedMockModel: true,
  };
}

export function predictionToAnalysis(
  prediction: ModelPrediction
): AnalysisResult {
  const { condition, confidence, allScores } = prediction;

  const analysisMap: Record<
    EyeCondition,
    Omit<AnalysisResult, "confidence" | "allScores">
  > = {
    healthy: {
      status: "healthy",
      condition: "healthy",
      findings: [
        "Kornea jernih tanpa kelainan yang terlihat",
        "Warna sklera normal",
        "Tidak terlihat adanya cairan peradangan",
        "Pupil tampak normal dan responsif",
      ],
      recommendations: [
        "Lanjutkan rutinitas perawatan mata Anda seperti biasa",
        "Jadwalkan pemeriksaan mata komprehensif 1-2 tahun sekali",
        "Ikuti aturan 20-20-20 untuk mengurangi ketegangan layar",
        "Gunakan kacamata hitam anti-UV di luar ruangan",
      ],
    },
    "dry-eye": {
      status: "warning",
      condition: "dry-eye",
      findings: [
        "Kemungkinan tanda stabilitas air mata yang berkurang",
        "Terdeteksi pola kemerahan atau iritasi ringan",
        "Ketidakteraturan permukaan yang mungkin mengindikasikan kekeringan",
      ],
      recommendations: [
        "Gunakan obat tetes mata pelumas yang bebas pengawet",
        "Ikuti aturan Istirahat 20-20-20 saat menatap layar",
        "Minum 8-10 gelas air putih setiap hari",
        "Gunakan humidifier jika di ruangan ber-AC",
        "Konsultasikan ke dokter mata jika gejala berlanjut",
      ],
    },
    conjunctivitis: {
      status: "caution",
      condition: "conjunctivitis",
      findings: [
        "Terdeteksi warna kemerahan / merah jambu",
        "Tanda-tanda konsisten dengan peradangan konjungtiva",
        "Terdeteksi adanya kotoran mata",
      ],
      recommendations: [
        "Temui dokter mata untuk diagnosis yang tepat",
        "Hindari menyentuh atau menggosok mata Anda",
        "Sering cuci tangan — kondisi ini bisa menular",
        "Hindari berbagi handuk atau riasan mata",
        "Kompres dingin dapat meredakan mata",
      ],
    },
    cataract: {
      status: "caution",
      condition: "cataract",
      findings: [
        "Terdeteksi kekeruhan pada lensa atau hamburan cahaya",
        "Tanda-tanda konsisten dengan perubahan kondisi lensa",
        "Kejernihan gambar berkurang saat dianalisis",
      ],
      recommendations: [
        "Jadwalkan pemeriksaan mata dengan dokter spesialis mata",
        "Minta pemeriksaan secara menyeluruh terhadap kejernihan lensa",
        "Gunakan pencahayaan yang lebih terang untuk bekerja jarak dekat",
        "Diskusikan opsi perawatan dengan dokter mata Anda",
        "Operasi katarak sangat aman dan sangat efektif bila diperlukan",
      ],
    },
    glaucoma: {
      status: "caution",
      condition: "glaucoma",
      findings: [
        "Terdeteksi pola yang menunjukkan kemungkinan perubahan saraf optik",
        "Terdeteksi faktor risiko peningkatan tekanan intraokular",
        "Kami sangat menyarankan evaluasi klinis lebih lanjut",
      ],
      recommendations: [
        "Segera temui dokter spesialis mata",
        "Minta dilakukan tes tonometri (tekanan mata)",
        "Pengujian lapang pandang sangat dianjurkan",
        "Glaukoma sangat bisa diobati bila terdeteksi lebih awal",
        "Pemantauan rutin sangat penting — jangan ditunda",
      ],
    },
  };

  return {
    ...analysisMap[condition],
    confidence,
    allScores,
  };
}
