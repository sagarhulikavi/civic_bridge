import os
import sys
import urllib.request
import zipfile
import shutil

NODE_VERSION = "v20.17.0"
NODE_DIR_NAME = f"node-{NODE_VERSION}-win-x64"
ZIP_URL = f"https://nodejs.org/dist/{NODE_VERSION}/{NODE_DIR_NAME}.zip"
DEST_DIR = os.path.abspath("C:/sahayog/tools")
ZIP_PATH = os.path.join(DEST_DIR, "node.zip")

def main():
    os.makedirs(DEST_DIR, exist_ok=True)
    target_node = os.path.join(DEST_DIR, "node", "node.exe")
    
    if os.path.exists(target_node):
        print(f"[OK] Node.js already exists at: {target_node}")
        return

    print(f"Downloading portable Node.js {NODE_VERSION} from {ZIP_URL}...")
    urllib.request.urlretrieve(ZIP_URL, ZIP_PATH)
    print("Extracting zip...")
    
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        zip_ref.extractall(DEST_DIR)
        
    extracted_folder = os.path.join(DEST_DIR, NODE_DIR_NAME)
    final_folder = os.path.join(DEST_DIR, "node")
    if os.path.exists(final_folder):
        shutil.rmtree(final_folder)
    shutil.move(extracted_folder, final_folder)
    
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
        
    print(f"[SUCCESS] Node.js portable setup complete! Path: {target_node}")

if __name__ == "__main__":
    main()
