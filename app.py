
import subprocess
import sys

def install_packages(packages):
    """Function to install packages."""
    for package in packages:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

packages = [
    'fastapi',
    'uvicorn',
    'torch',
    'onnxruntime',
    'torchvision',
    'numpy',
    'opencv-python',
    'rembg',
    'scikit-learn',
    'Pillow',
    'tqdm',
    'scipy',
    'python-multipart'
]

install_packages(packages)
from torchvision.ops import nms
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
import onnxruntime as ort
from torchvision.transforms import ToTensor
import numpy as np
import os
import rembg
from collections import Counter
from sklearn.cluster import KMeans
import cv2
import subprocess
import sys
from scipy.ndimage import gaussian_filter
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter  
from tqdm import tqdm
from concurrent.futures import ProcessPoolExecutor, as_completed
from concurrent.futures import ThreadPoolExecutor
app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Load ONNX models with GPU support
providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
model_classify_path = r"C:\Users\Asad\Desktop\hemaidx-website-project\model.onnx"
model_stain_path = r"C:\Users\Asad\Desktop\hemaidx-website-project\pix2pixhd_generator.onnx"
sess_classify = ort.InferenceSession(model_classify_path, providers=providers)
sess_stain = ort.InferenceSession(model_stain_path, providers=providers)

ort.set_default_logger_severity(3)
Image.MAX_IMAGE_PIXELS = 1_866_240_000

classes = ['Others', 'lymphocyte', 'monocyte', 'neutrophil']

def safe_delete_folder_contents(folder_path):
    """Safely deletes all files in a folder"""
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")

output_dir = "processed_images"
os.makedirs(output_dir, exist_ok=True)
safe_delete_folder_contents(output_dir)

def find_background_color(image):
    """Detects the background color using KMeans clustering."""
    image_array = np.array(image)
    h, w, _ = image_array.shape
    rgb_pixels = image_array[:, :, :3].reshape(-1, 3)
    kmeans = KMeans(n_clusters=3, random_state=0, n_init=10).fit(rgb_pixels)
    dominant_colors = kmeans.cluster_centers_.astype(int)
    labels = kmeans.labels_
    label_counts = Counter(labels)
    background_label = label_counts.most_common(1)[0][0]
    return tuple(dominant_colors[background_label])




def create_patches(image_path, patch_size, output_dir):
    image = Image.open(image_path).convert('RGB')
    orig_w, orig_h = image.size
    
    # Create dedicated patch directory
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    patch_dir = os.path.join(output_dir, f"patches_{base_name}")
    os.makedirs(patch_dir, exist_ok=True)
    safe_delete_folder_contents(patch_dir)

    # Calculate padding to make image divisible by patch_size/2
    def calc_padding(dim):
        stride = patch_size // 2
        return (stride - (dim % stride)) % stride

    pad_x = calc_padding(orig_w)
    pad_y = calc_padding(orig_h)

    padded_image = ImageOps.expand(image, (0, 0, pad_x, pad_y), fill=0)
    pad_w, pad_h = padded_image.size

    # Generate patches with 50% overlap
    for y in range(0, pad_h - patch_size + 1, patch_size // 2):
        for x in range(0, pad_w - patch_size + 1, patch_size // 2):
            patch = padded_image.crop((x, y, x + patch_size, y + patch_size))
            patch_name = f"patch_{x:04d}_{y:04d}.png"
            patch.save(os.path.join(patch_dir, patch_name))
    
    return patch_dir, (pad_w, pad_h), (pad_x, pad_y)

import concurrent.futures

def process_patch(patch_file, model, patch_dir, processed_dir):
    if not patch_file.endswith('.png'):
        return
    
    try:
        x = int(patch_file.split('_')[1])
        y = int(patch_file.split('_')[2].split('.')[0])
        
        patch_path = os.path.join(patch_dir, patch_file)
        img = Image.open(patch_path).convert('RGB')
        img_tensor = (np.array(img).astype(np.float32) / 127.5) - 1.0
        img_tensor = np.transpose(img_tensor, (2, 0, 1))[np.newaxis, ...]
        
        result = model.run(None, {'input': img_tensor})[0]
        
        result = (np.transpose(result[0], (1, 2, 0)) + 1) * 127.5
        result = np.clip(result, 0, 255).astype(np.uint8)
        
        Image.fromarray(result).save(os.path.join(processed_dir, f"processed_{x:04d}_{y:04d}.png"))
    
    except Exception as e:
        print(f"Error processing {patch_file}: {str(e)}")

def process_patches(model, patch_dir, processed_dir, max_workers=12):
    from shutil import rmtree
    os.makedirs(processed_dir, exist_ok=True)
    
    # Clear previous output
    for f in os.listdir(processed_dir):
        os.remove(os.path.join(processed_dir, f))

    patch_files = [f for f in os.listdir(patch_dir) if f.endswith('.png')]

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        list(tqdm(
            executor.map(lambda f: process_patch(f, model, patch_dir, processed_dir), patch_files),
            total=len(patch_files),
            desc="Processing Patches"
        ))



def reconstruct_image(processed_dir, padded_size, patch_size, pad):
    pad_w, pad_h = padded_size
    pad_x, pad_y = pad
    canvas = np.zeros((pad_h, pad_w, 3), dtype=np.float32)
    weights = np.zeros((pad_h, pad_w), dtype=np.float32)
    
    # Create Gaussian blending mask
    x, y = np.meshgrid(np.linspace(-1, 1, patch_size), np.linspace(-1, 1, patch_size))
    mask = np.exp(-(x**2 + y**2))
    mask = mask / mask.max()
    
    for patch_file in tqdm(os.listdir(processed_dir), desc="Blending"):
        if not patch_file.startswith('processed_'):
            continue
            
        try:
            parts = patch_file.split('_')
            x = int(parts[1])
            y = int(parts[2].split('.')[0])
            
            patch_path = os.path.join(processed_dir, patch_file)
            patch_data = np.array(Image.open(patch_path))
            
            y_end = min(y + patch_size, pad_h)
            x_end = min(x + patch_size, pad_w)
            h, w = y_end - y, x_end - x

            canvas[y:y_end, x:x_end] += patch_data[:h, :w] * mask[:h, :w, np.newaxis]
            weights[y:y_end, x:x_end] += mask[:h, :w]
            
        except Exception as e:
            print(f"Error blending {patch_file}: {str(e)}")
    
    # Normalize
    canvas = np.divide(canvas, weights[..., np.newaxis], where=weights[..., np.newaxis] > 0)

    # Crop padding only
    final_image = canvas[0:pad_h - pad_y, 0:pad_w - pad_x]
    return Image.fromarray(final_image.astype(np.uint8))



@app.post("/virtual-staining/")

async def virtual_staining(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        image_path = os.path.join(output_dir, file.filename)
        with open(image_path, "wb") as f:
            f.write(file.file.read())
        im = Image.open(image_path).convert('RGBA')

        base_name = os.path.splitext(os.path.basename(image_path))[0]
 
        patch_dir, padded_size, pad = create_patches(image_path, 512, output_dir)

        processed_dir = os.path.join(output_dir, f"processed_{base_name}")
        
        process_patches(sess_stain, patch_dir, processed_dir)

        reconstructed = reconstruct_image(processed_dir, padded_size, 512, pad)

        final_path = os.path.join(output_dir, f"{base_name}_result.jpg")

        cleaned = Image.fromarray(rembg.remove(np.array(im)))
        background_mask = cleaned.getchannel('A')
        
        # Calculate background area percentage
        binary_mask = background_mask.point(lambda x: 255 if x > 128 else 0)
        background_pixels = np.array(binary_mask).sum() / 255
        total_pixels = binary_mask.size[0] * binary_mask.size[1]
        background_ratio = background_pixels / total_pixels
        print('background ratio', background_ratio)


        # Adaptive threshold check
        if background_ratio > 0.4:

            background_mask = cleaned.getchannel('A').point(lambda x: 255 - x)

            processed = reconstructed.convert('RGBA')
            background = Image.composite(
                im,
                Image.new('RGBA', im.size, (0, 0, 0, 0)),
                background_mask
            ).convert('RGBA')
            
            final_image = Image.alpha_composite(processed.resize(im.size), background)
            final_image.convert('RGB').save(final_path)
        else:
            reconstructed.convert('RGB').save(final_path)

        return FileResponse(final_path, media_type="image/jpeg", filename=f"stained_{file.filename}")

    except Exception as e:
        return {"error": f"Virtual staining failed: {str(e)}"}
    
@app.post("/classify/")
async def classify_image(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        image_path = os.path.join(output_dir, file.filename)
        with open(image_path, "wb") as f:
            f.write(file.file.read())

        im = Image.open(image_path).convert('RGB')
        width, height =im.size
        im = im.resize((640, 640))
        im_data = ToTensor()(im)[None]  # Add batch dimension
        print(f"Processing: {image_path}, Shape: {im_data.shape}")
        size = torch.tensor([[640, 640]])
        output = sess_classify.run(
            output_names=None,
            input_feed={'images': im_data.numpy(), "orig_target_sizes": size.numpy()}
        )
        labels, boxes, scores = output
        thrh = 0.5
        scores = torch.tensor(scores[0]) 
        boxes = torch.tensor(boxes[0])
        labels = torch.tensor(labels[0])
        mask = scores > thrh
        boxes = boxes[mask]
        scores = scores[mask]
        labels = labels[mask]
        # Apply cross-class NMS
        keep = nms(boxes, scores, 0.4) 
        boxes = boxes[keep]
        scores = scores[keep]
        labels = labels[keep]
        draw = ImageDraw.Draw(im)
        font = ImageFont.load_default()

        for i, (box, score, label) in enumerate(zip(boxes, scores, labels)):

            draw.rectangle(list(box), outline='red', width=2)
            label_text = f"{classes[int(label.item())]}"
            draw.text((box[0], box[1] - 10), text=label_text, fill='blue', font=font)

        output_path = os.path.join(output_dir, f"processed_{file.filename}")
        im = im.resize((width, height))
        im.save(output_path)

        return FileResponse(output_path, media_type="image/jpg", filename=f"processed_{file.filename}")
    
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}
