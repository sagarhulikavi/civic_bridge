import os
from PIL import Image, ImageDraw

UPLOAD_DIR = os.path.abspath("C:/sahayog/backend/uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

samples = [
    ("road_damage_ranchi.jpg", (80, 80, 80), "Road Infrastructure - Pothole Surface Damage"),
    ("water_pipe_leak_hazaribagh.jpg", (40, 90, 140), "Water & Sanitation - Pipeline Fracture"),
    ("transformer_fault_bokaro.jpg", (160, 60, 50), "Electricity & Power - Open Transformer Risk"),
    ("waste_dump_dhanbad.jpg", (100, 110, 80), "Waste Management - Drainage Choke"),
    ("canal_irrigation_ghatshila.jpg", (60, 120, 80), "Agriculture - Irrigation Canal Siltation"),
    ("open_manhole_deoghar.jpg", (120, 50, 50), "Public Safety - Open Manhole Hazard")
]

for filename, color, label in samples:
    img_path = os.path.join(UPLOAD_DIR, filename)
    img = Image.new('RGB', (600, 400), color=color)
    draw = ImageDraw.Draw(img)
    # Draw simple frame & visual indication
    draw.rectangle([20, 20, 580, 380], outline=(255, 255, 255), width=3)
    draw.text((40, 180), label, fill=(255, 255, 255))
    img.save(img_path, format='JPEG')
    print(f"Generated sample image: {img_path}")
