from flask import Flask, request, jsonify, send_file
import requests
import os
from PIL import Image
import io
from googletrans import Translator
from flask_cors import CORS  # Import CORS

API_KEY = "74d9d9475e8bf08cb2c68794cec9b7d28617d999ed370df76d96040ded1954ddf0e0d2f9f0a16c221dbdc699d7ac3ebf"
API_URL = "https://clipdrop-api.co/text-to-image/v1"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def translate_prompt(prompt, src='vi', dest='en'):
    translator = Translator()
    translated = translator.translate(prompt, src=src, dest=dest)
    return translated.text

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.get_json()
        prompt = data.get("prompt")

        if not prompt:
            return jsonify({"error": "Missing 'prompt' in request body"}), 400

        prompt_en = translate_prompt(prompt)
        print(f"Translated prompt: {prompt_en}")

        files = {
            "prompt": (None, prompt_en, "text/plain")
        }
        headers = {
            "x-api-key": API_KEY
        }

        response = requests.post(API_URL, headers=headers, files=files)
        if response.status_code != 200:
            return jsonify({"error": f"Request failed: {response.status_code}", "details": response.text}), response.status_code

        image = Image.open(io.BytesIO(response.content))
        output_path = "generated_image.png"
        image.save(output_path)

        return send_file(output_path, mimetype="image/png")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5123, debug=True)
