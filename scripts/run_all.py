import subprocess
import os
import time
import sys
import signal

import config

def run_command_in_new_terminal(command, cwd=None, name="Process"):
    print(f"Attempting to start {name} in a new Command Prompt window.")
    try:
        process = subprocess.Popen(f'start cmd /k "cd /d "{cwd}" && {command}"', shell=True)
        print(f"{name} started in a new Windows Command Prompt window.")
        return process
    except Exception as e:
        print(f"Failed to open new Windows CMD for {name}: {e}. Falling back to running in current terminal.")
        process = subprocess.Popen(command, shell=True, cwd=cwd)
        return process

def run_frontend():
    print(f"Navigating to frontend directory: {config.FRONTEND_DIR}")
    if not os.path.exists(config.FRONTEND_DIR):
        print(f"Error: Frontend directory not found at {config.FRONTEND_DIR}")
        return None
    
    print("Starting frontend (npm start)...")
    process = subprocess.Popen("npm start", shell=True, cwd=config.FRONTEND_DIR)
    return process

# New function specifically for non-Conda backend
def run_simple_backend(command, name, cwd):
    print(f"Navigating to backend directory: {cwd}")
    if not os.path.exists(cwd):
        print(f"Error: Backend directory not found at {cwd}")
        return None
    
    print(f"Starting backend ({name})...")
    process = run_command_in_new_terminal(command, cwd=cwd, name=name)
    return process

def run_conda_backend(command, name, env_name, cwd):
    print(f"Navigating to backend directory: {cwd}")
    if not os.path.exists(cwd):
        print(f"Error: Backend directory not found at {cwd}")
        return None

    full_command = f'call conda activate {env_name} && {command}'
    
    print(f"Starting backend ({name}) in Conda environment '{env_name}'...")
    process = run_command_in_new_terminal(full_command, cwd=cwd, name=name)
    return process

def terminate_processes(processes):
    for p in processes:
        if p and p.poll() is None:
            print(f"Terminating process with PID: {p.pid}...")
            try:
                subprocess.run(['taskkill', '/F', '/T', '/PID', str(p.pid)], check=False,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            except Exception as e:
                print(f"Error terminating process {p.pid}: {e}")
            finally:
                try:
                    p.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    print(f"Process {p.pid} did not terminate gracefully after 5s.")
        elif p:
            print(f"Process with PID: {p.pid} already exited.")

def main():
    processes = []

    try:
        print("--- Starting Services ---")

        frontend_process = run_frontend()
        if frontend_process:
            processes.append(frontend_process)
        time.sleep(config.INITIAL_STARTUP_DELAY_SECONDS) 

        # Start Backend Model 1 (LatentSync) with Conda environment
        backend_latentsync_process = run_conda_backend(
            config.BACKEND_LATENTSYNC_COMMAND, 
            "LatentSync Backend", 
            config.CONDA_ENV_NAME_LATENTSYNC, 
            config.BACKEND_LATENTSYNC_DIR
        )
        if backend_latentsync_process:
            processes.append(backend_latentsync_process)
        time.sleep(config.MODEL_STARTUP_DELAY_SECONDS) 

        # Start Backend Model 2 (TTS_api) WITHOUT Conda environment
        backend_tts_process = run_simple_backend(
            config.BACKEND_TTS_COMMAND, 
            "TTS API Backend", 
            config.BACKEND_TTS_DIR
        )
        if backend_tts_process:
            processes.append(backend_tts_process)
        time.sleep(config.MODEL_STARTUP_DELAY_SECONDS) 

        print("\nAll processes initiated. Press Ctrl+C to stop.\n")

        while True:
            for i, p in enumerate(processes):
                if p and p.poll() is not None:
                    print(f"Warning: Process {p.pid} (Command: {' '.join(p.args) if p.args else 'N/A'}) has exited with code {p.returncode}.")
                    processes[i] = None
            
            if all(p is None or p.poll() is not None for p in processes):
                print("All child processes have exited. Exiting main script.")
                break

            time.sleep(1)

    except KeyboardInterrupt:
        print("\n--- Ctrl+C detected. Initiating graceful shutdown... ---")
    except Exception as e:
        print(f"\nAn unhandled error occurred: {e}")
    finally:
        print("--- Terminating remaining processes ---")
        terminate_processes(processes)
        print("All services stopped.")

if __name__ == "__main__":
    main()