import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIR = r"C:\Users\navee\Documents\Avatar_Lab[1]\Avatar_Lab frontend\FRONT-END"
BACKEND_LATENTSYNC_DIR = r"C:\Users\navee\Documents\Avatar_Lab[1]\avatar_lab backend\LatentSync\api"
BACKEND_TTS_DIR = r"C:\Users\navee\Documents\Avatar_Lab[1]\avatar_lab backend\TTS_api"

CONDA_ENV_NAME_LATENTSYNC = "latentsync" # Renamed for clarity

BACKEND_LATENTSYNC_COMMAND = "python app.py"
BACKEND_TTS_COMMAND = "python app.py" # No Conda activation for this one

INITIAL_STARTUP_DELAY_SECONDS = 3
MODEL_STARTUP_DELAY_SECONDS = 4