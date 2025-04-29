from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import uuid
import sys
from omegaconf import OmegaConf

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.inference import main as run_inference

app = Flask(__name__)
UPLOAD_FOLDER = 'temp'
OUTPUT_FOLDER = 'outputs'
CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'configs', 'unet', 'stage2.yaml'))

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return "LatentSync API is up and running 🚀"

@app.route('/api/lipsync', methods=['POST'])
def lipsync():
    import cv2

    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    video = request.files['video']
    filename = secure_filename(video.filename)
    unique_name = f"{uuid.uuid4()}_{filename}"
    video_path = os.path.join(UPLOAD_FOLDER, unique_name)
    video.save(video_path)

    if os.path.getsize(video_path) == 0:
        os.remove(video_path)
        return jsonify({'error': 'Invalid or empty video file'}), 400

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        cap.release()
        os.remove(video_path)
        return jsonify({'error': 'Invalid or empty video file'}), 400
    cap.release()

    audio = request.files['audio']
    audio_filename = secure_filename(audio.filename)
    audio_unique_name = f"{uuid.uuid4()}_{audio_filename}"
    audio_path = os.path.join(UPLOAD_FOLDER, audio_unique_name)
    audio.save(audio_path)

    try:
        config = OmegaConf.load(CONFIG_PATH)

        overrides = OmegaConf.create({
            'input_video_path': video_path,
            'output_path': os.path.join(OUTPUT_FOLDER, f"out_{unique_name}"),
        })
        config = OmegaConf.merge(config, overrides)

        from types import SimpleNamespace
        args = SimpleNamespace(
            inference_ckpt_path=r"C:\Users\navee\Downloads\LatentSync\checkpoints\latentsync_unet.pt",
            video_path=video_path,
            audio_path=audio_path,
            video_out_path=config.output_path,
            inference_steps=20,
            guidance_scale=1.0,
            seed=42
        )

        print(f"[INFO] Running inference on {video_path}")
        result = run_inference(config=config, args=args)
        output_path = result.get('output_path') if isinstance(result, dict) else config.output_path

        if not os.path.exists(output_path):
            raise FileNotFoundError(f"Output file not found: {output_path}")

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        import threading

        def cleanup_files():
            if os.path.exists(video_path):
                os.remove(video_path)
            if os.path.exists(audio_path):
                os.remove(audio_path)

        cleanup_thread = threading.Thread(target=cleanup_files)
        cleanup_thread.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
