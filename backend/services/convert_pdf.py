import sys
import json
import fitz  # PyMuPDF
import os

def convert_pdf(pdf_path, output_folder="temp_images"):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    try:
        doc = fitz.open(pdf_path)
        image_paths = []

        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=150)  # Faster rendering with lower DPI
            image_path = os.path.join(output_folder, f"page_{i+1}.png")
            pix.save(image_path)
            image_paths.append(image_path)

        response = {"success": True, "images": image_paths}
        print(json.dumps(response))

    except Exception as e:
        response = {"success": False, "error": str(e)}
        print(json.dumps(response))

if __name__ == "__main__":
    convert_pdf(sys.argv[1])