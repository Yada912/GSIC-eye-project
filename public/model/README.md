# Eye Condition Classification Model

## Overview
This folder contains the template structure for training an eye condition classification model using TensorFlow/Keras.

## Folder Structure
```
model/
├── README.md                    ← You are here
├── training-images/
│   ├── healthy/                 ← Place healthy eye images here
│   ├── dry-eye/                 ← Place dry eye images here
│   ├── conjunctivitis/          ← Place conjunctivitis/pink eye images here
│   ├── cataract/                ← Place cataract images here
│   └── glaucoma/                ← Place glaucoma images here
├── model.json                   ← Generated after training (TensorFlow.js format)
└── weights.bin                  ← Generated after training
```

## How to Add Training Images

1. Collect high-quality eye images (minimum 100 per category, ideally 500+)
2. Recommended image specs:
   - Resolution: at least 224x224 pixels
   - Format: JPG or PNG
   - Clear, well-lit images
   - Front-facing eye close-up
3. Place images in the appropriate category subfolder
4. Run the training script: `python scripts/train_model.py`

## Image Sources (for educational/research purposes)
- Kaggle Eye Disease datasets
- STARE (Structured Analysis of the Retina)
- ORIGA retinal image dataset
- Messidor dataset (diabetic retinopathy)
- RIM-ONE dataset (glaucoma)
- Always ensure you have proper licensing rights for images used

## Training the Model

### Requirements
```bash
pip install tensorflow pillow numpy scikit-learn tensorflowjs
```

### Run Training
```bash
cd GSIC
python scripts/train_model.py
```

### After Training
Copy the generated files to this folder:
- `model.json`
- `weights.bin` (or shard files)

The app will automatically load the model from this folder.

## Model Architecture
The template uses MobileNetV2 (transfer learning) — lightweight and suitable for mobile/web use.
- Input: 224x224x3 RGB image
- Base: MobileNetV2 pretrained on ImageNet
- Output: 5-class softmax (healthy, dry-eye, conjunctivitis, cataract, glaucoma)

## Important Disclaimer
This model is for EDUCATIONAL and SCREENING purposes only.
It is NOT a medical diagnostic tool and should NOT replace professional eye examinations.
