import sys
import json
import easyocr

def extract_text(image_path):
    reader = easyocr.Reader(["en"])
    results = reader.readtext(image_path)
    text = " ".join([entry[1] for entry in results])
    
    response = {"text": text, "confidence": 0.90}  # Approximate confidence score
    print(json.dumps(response))  # Send JSON output to Node.js

if __name__ == "__main__":
    extract_text(sys.argv[1])