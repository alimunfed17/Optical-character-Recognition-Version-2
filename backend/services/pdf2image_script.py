# import sys
# import os
# from pdf2image import convert_from_path

# def convert_pdf_to_images(pdf_path, output_prefix):
#     images = convert_from_path(pdf_path, dpi=300)  # High DPI for better OCR
#     image_paths = []

#     for i, image in enumerate(images):
#         image_path = f"{output_prefix}_{i + 1}.png"
#         image.save(image_path, "PNG")
#         image_paths.append(image_path)

#     print(" ".join(image_paths))  # Output file paths for Node.js

# if __name__ == "__main__":
#     pdf_path = sys.argv[1]
#     output_prefix = sys.argv[2]
#     convert_pdf_to_images(pdf_path, output_prefix)