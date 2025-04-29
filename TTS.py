from flask import Flask, request, jsonify, send_file
import os
import io
import uuid
import requests
import traceback
import torch
import torchaudio
from flask_cors import CORS

# Set eSpeak NG environment for phonemizer
os.environ['PHONEMIZER_ESPEAK_LIBRARY'] = r'C:\Program Files\eSpeak NG\libespeak-ng.dll'
os.environ['PATH'] += os.pathsep + r'C:\Program Files\eSpeak NG'

import torch._dynamo
torch._dynamo.config.suppress_errors = True

from phonemizer.backend import EspeakBackend
from zonos.model import Zonos
from zonos.conditioning import make_cond_dict
from zonos.utils import DEFAULT_DEVICE as device

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})
OUTPUT_FOLDER = 'outputs'
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)

@app.route("/")
def index():
    return "Zonos TTS API is up and running 🚀"

@app.route('/api/generate_speech', methods=['POST'])
def generate_speech():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    if 'speaker_audio_path' not in data:
        return jsonify({'error': 'No speaker audio path provided'}), 400

    text = data['text']
    speaker_audio_path = data['speaker_audio_path']
    language = data.get('language', 'en-us')

    try:
        # Handle both URL and local file path
        if speaker_audio_path.startswith('http://') or speaker_audio_path.startswith('https://'):
            print(f"[INFO] Downloading speaker audio from URL: {speaker_audio_path}")
            response = requests.get(speaker_audio_path)
            if response.status_code != 200:
                raise Exception(f"Failed to download audio. Status code: {response.status_code}")
            audio_buffer = io.BytesIO(response.content)
            wav, sampling_rate = torchaudio.load(audio_buffer)
        else:
            speaker_audio_path = os.path.abspath(speaker_audio_path)
            print(f"[INFO] Loading speaker audio from file: {speaker_audio_path}")
            wav, sampling_rate = torchaudio.load(speaker_audio_path)

        speaker = model.make_speaker_embedding(wav, sampling_rate)
        cond_dict = make_cond_dict(text=text, speaker=speaker, language=language)
        conditioning = model.prepare_conditioning(cond_dict)

        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()

        output_path = os.path.join(OUTPUT_FOLDER, f"{uuid.uuid4()}.wav")
        torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)

        print(f"[INFO] Generated speech saved to: {output_path}")
        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        traceback.print_exc()
        import sys
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = exc_tb.tb_frame.f_code.co_filename
        lineno = exc_tb.tb_lineno
        return jsonify({'error': str(e), 'type': str(exc_type), 'file': fname, 'line': lineno}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
