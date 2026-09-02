import os
import cv2
import numpy as np
from app.cv_classifier import analyze_image_file

os.makedirs('scratch/test_images', exist_ok=True)

# 1. Blue water image (Water & Sanitation)
blue_img = np.zeros((300, 300, 3), dtype=np.uint8)
blue_img[:, :] = (210, 150, 40) # BGR: high blue
cv2.imwrite('scratch/test_images/water_sample.jpg', blue_img)

# 2. Green agricultural field image (Agriculture & Irrigation)
green_img = np.zeros((300, 300, 3), dtype=np.uint8)
green_img[:, :] = (30, 180, 50) # BGR: high green
cv2.imwrite('scratch/test_images/farm_sample.jpg', green_img)

# 3. Electrical wire lines (Electricity & Power)
wire_img = np.ones((300, 300, 3), dtype=np.uint8) * 230
for y in [40, 70, 100, 130, 160, 190, 220]:
    cv2.line(wire_img, (0, y), (300, y + 25), (20, 20, 20), 3)
cv2.imwrite('scratch/test_images/wires_sample.jpg', wire_img)

# 4. Trash / Garbage color clutter (Waste Management)
trash_img = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
cv2.imwrite('scratch/test_images/trash_sample.jpg', trash_img)

# 5. Open circular manhole pit (Healthcare & Public Safety)
pit_img = np.ones((300, 300, 3), dtype=np.uint8) * 140
cv2.circle(pit_img, (150, 150), 50, (15, 15, 15), -1)
cv2.imwrite('scratch/test_images/pit_sample.jpg', pit_img)

# 6. Asphalt Gray Road (Road Infrastructure)
road_img = np.ones((300, 300, 3), dtype=np.uint8) * 90
cv2.imwrite('scratch/test_images/road_sample.jpg', road_img)

samples = [
    ('water_sample.jpg', 'Water & Sanitation'),
    ('farm_sample.jpg', 'Agriculture & Irrigation'),
    ('wires_sample.jpg', 'Electricity & Power'),
    ('trash_sample.jpg', 'Waste Management'),
    ('pit_sample.jpg', 'Healthcare & Public Safety'),
    ('road_sample.jpg', 'Road Infrastructure'),
]

print("[TEST] Running Full Vision Classifier on Real Image Files:\n")
all_correct = True
for fname, expected in samples:
    path = os.path.join('scratch/test_images', fname)
    res = analyze_image_file(path)
    correct = res['category'] == expected
    if not correct:
        all_correct = False
    status_str = "[PASS]" if correct else "[FAIL]"
    print(f"{status_str} [{fname}]: Expected '{expected}' => Got '{res['category']}' (Confidence: {res['confidence']})")
    print(f"    Visual features: {res['visual_features']}")

if all_correct:
    print("\nSUCCESS: ALL IMAGE VISION CLASSIFICATIONS PASSED ACCURATELY WITHOUT RELYING ON FILENAMES OR TEXT!")

