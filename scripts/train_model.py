"""
Eye Condition Classification Model Training Script
===================================================
This script trains a MobileNetV2-based image classifier for eye condition detection.

Usage:
    pip install tensorflow pillow numpy scikit-learn tensorflowjs
    python scripts/train_model.py

Output:
    public/model/model.json
    public/model/weights.bin (or shards)

Categories:
    - healthy
    - dry-eye
    - conjunctivitis
    - cataract
    - glaucoma
"""

import os
import numpy as np
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────
IMG_SIZE = 224           # Input image size (MobileNetV2 default)
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 1e-4
VALIDATION_SPLIT = 0.2
RANDOM_SEED = 42

CATEGORIES = ["healthy", "dry-eye", "conjunctivitis", "cataract", "glaucoma"]

BASE_DIR = Path(__file__).parent.parent
TRAIN_DIR = BASE_DIR / "public" / "model" / "training-images"
OUTPUT_DIR = BASE_DIR / "public" / "model"

# ─── Check for required packages ──────────────────────────────────
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    print(f"TensorFlow version: {tf.__version__}")
except ImportError:
    print("ERROR: TensorFlow not found. Install with: pip install tensorflow")
    exit(1)

try:
    import tensorflowjs as tfjs
    print(f"TensorFlow.js converter available")
except ImportError:
    print("WARNING: tensorflowjs not found. Install with: pip install tensorflowjs")
    print("You won't be able to convert to TF.js format without it.")
    tfjs = None

# ─── Check training data ──────────────────────────────────────────
def check_data():
    """Verify training data exists and print summary."""
    total_images = 0
    print("\n=== Training Data Summary ===")
    for category in CATEGORIES:
        cat_dir = TRAIN_DIR / category
        if not cat_dir.exists():
            print(f"  ❌ {category}: folder not found")
            continue
        images = list(cat_dir.glob("*.jpg")) + list(cat_dir.glob("*.jpeg")) + list(cat_dir.glob("*.png"))
        count = len(images)
        total_images += count
        status = "✅" if count >= 50 else "⚠️ (need more images)" if count > 0 else "❌ (empty)"
        print(f"  {status} {category}: {count} images")
    print(f"\n  Total: {total_images} images")
    
    if total_images < 50:
        print("\nERROR: Not enough training images. Add images to the training-images folder.")
        print("Minimum 50 per category, recommended 200+")
        return False
    return True

# ─── Build Model ──────────────────────────────────────────────────
def build_model(num_classes: int):
    """Build MobileNetV2 transfer learning model."""
    # Load pretrained MobileNetV2 without top classification layer
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights="imagenet"
    )
    
    # Freeze base model layers initially
    base_model.trainable = False
    
    # Build classification head
    inputs = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    
    model = keras.Model(inputs, outputs)
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy", keras.metrics.AUC(name="auc")]
    )
    
    return model, base_model

# ─── Data Generators ──────────────────────────────────────────────
def create_data_generators():
    """Create training and validation data generators with augmentation."""
    train_datagen = ImageDataGenerator(
        preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input,
        validation_split=VALIDATION_SPLIT,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest"
    )
    
    train_gen = train_datagen.flow_from_directory(
        str(TRAIN_DIR),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        seed=RANDOM_SEED,
        classes=CATEGORIES
    )
    
    val_gen = train_datagen.flow_from_directory(
        str(TRAIN_DIR),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        seed=RANDOM_SEED,
        classes=CATEGORIES
    )
    
    return train_gen, val_gen

# ─── Training ─────────────────────────────────────────────────────
def train():
    """Main training function."""
    print("\n=== Starting Training ===\n")
    
    if not check_data():
        return
    
    train_gen, val_gen = create_data_generators()
    num_classes = len(CATEGORIES)
    
    print(f"\nClass mapping: {train_gen.class_indices}")
    print(f"Training samples: {train_gen.samples}")
    print(f"Validation samples: {val_gen.samples}")
    
    model, base_model = build_model(num_classes)
    model.summary()
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        keras.callbacks.ModelCheckpoint(
            str(OUTPUT_DIR / "best_model.keras"),
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Phase 1: Train with frozen base
    print("\n--- Phase 1: Training classification head ---")
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS // 2,
        callbacks=callbacks,
        verbose=1
    )
    
    # Phase 2: Fine-tune top layers of base model
    print("\n--- Phase 2: Fine-tuning top layers ---")
    base_model.trainable = True
    # Only fine-tune the top 30 layers
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
        loss="categorical_crossentropy",
        metrics=["accuracy", keras.metrics.AUC(name="auc")]
    )
    
    history_fine = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        initial_epoch=EPOCHS // 2,
        callbacks=callbacks,
        verbose=1
    )
    
    # ─── Save Model ───────────────────────────────────────────────
    print(f"\n=== Saving Model ===")
    
    # Save Keras model
    model.save(str(OUTPUT_DIR / "eye_model.keras"))
    print(f"✅ Keras model saved: {OUTPUT_DIR / 'eye_model.keras'}")
    
    # Convert to TensorFlow.js format
    if tfjs:
        tfjs.converters.save_keras_model(model, str(OUTPUT_DIR))
        print(f"✅ TF.js model saved: {OUTPUT_DIR / 'model.json'}")
    else:
        print("⚠️  Install tensorflowjs to convert for web use")
        print("   pip install tensorflowjs")
        print("   tensorflowjs_converter --input_format keras eye_model.keras public/model/")
    
    # Save class mapping
    import json
    class_names = {v: k for k, v in train_gen.class_indices.items()}
    with open(OUTPUT_DIR / "class_names.json", "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"✅ Class names saved: {OUTPUT_DIR / 'class_names.json'}")
    
    print("\n=== Training Complete! ===")
    print(f"Final validation accuracy: {max(history_fine.history.get('val_accuracy', [0])):.1%}")

if __name__ == "__main__":
    train()
