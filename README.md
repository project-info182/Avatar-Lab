
# ⚡️ Avatar Lab – Where AI Meets Emotion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/github/contributors/project-info182/Avatar-Lab.svg)](https://github.com/project-info182/Avatar-Lab/graphs/contributors)
Welcome to **Avatar Lab** – the next generation of intelligent, emotionally expressive avatar animation. More than just lip-syncing, Avatar Lab combines powerful neural speech synthesis and state-of-the-art animation model to generate **realistic**, **emotion-aware avatars** that move, speak, and feel like real humans.

Whether you're building virtual assistants, game characters, or AI-driven content creators, Avatar Lab brings your digital personas to life.

---

## 📜 Table of Contents
- [🎯 Why Avatar Lab?](#-why-avatar-lab)
- [🚀 Getting Started](#-getting-started)
- [🧬 System Architecture](#-system-architecture)
- [🧱 Technology Stack](#-technology-stack)
- [🛠️ Workflow: From Text to Expressive Avatar](#️-workflow-from-text-to-expressive-avatar)
- [SDLC](#️-software-development-life-cycle)
- [🔬 Models Explored](#-models-we-explored)
- [✅ Models Chosen for Avatar Lab](#-models-we-have-choosed-for-our-project)
- [🚀 Use Cases](#-use-cases)
- [🗺️ Project Milestones & Roadmap](#️-project-milestones--roadmap)
- [📈 Project Updates](#-project-updates)
- [🤝 Contribute or Collaborate](#-contribute-or-collaborate)
- [👥 Contributors](#-contributors)

---

## 🎯 Why Avatar Lab?

Most avatar tools stop at syncing lips to sound. **We go further.**

Avatar Lab delivers avatars with:
- 🎙 **Neural Speech Synthesis:** Realistic, expressive speech via cutting-edge TTS models.
- 🗣 **True-to-Life Lip Sync:** Facial animations that match audio at a near-human level.
- 👀 **Emotional Facial Motion:** Micro-expressions, eye blinks, and head tilts for authentic avatars.

---

## 🚀 Getting Started

This project contains a frontend, backend, and AI model components.

### Prerequisites
- React router v5
- Node.js (e.g., v18.x or later)
- npm / yarn
- Python (e.g., v3.9+) & pip
- MongoDB instance (local or cloud)
- Specific Python libraries for AI models (e.g., PyTorch, Transformers - list them)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/project-info182/Avatar-Lab.git
    cd Avatar-Lab
    ```

2.  **Backend Setup:**
    ```bash
    cd backend # Or your backend folder name
    npm install
    # Create a .env file based on .env.example and configure variables (DB_URI, ports etc.)
    python tts.py ( starting zonos api)

    python animation.py (starting LatentSync api)
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend # Or your frontend folder name (e.g., the one with package.json for Next.js app)
    npm install
    # Configure any necessary environment variables for the frontend (e.g., API endpoint)
    npm run dev
    ```

4.  **AI Model Setup (Zonos TTS & LatentSync):**
    *(Detailed instructions needed here)*
    - Create 2 virtual environment setup for 2 models (e.g., `python -m venv .venv && source .venv/bin/activate`)
    - `pip install -r requirements.txt` (different requirements for each model)
    - Downloading pre-trained model weights.
    - Configuration for model API endpoints as they run as separate services.

### Basic Usage / API Interaction
- Access the web interface at `http://localhost:3000` (or your frontend port).
- API endpoints (example):
    - `POST /api/generate-speech` (Input: text, voice_id; Output: audio_file_url)
    - `POST /api/lipsync` (Input: video_url, audio_file_url; Output: video_file_url)


---

## 🧬 System Architecture

![System Architecture Diagram for Avatar Lab](https://github.com/project-info182/Avatar-Lab/blob/46361b8df980249181c82c540b1f1bfc54f374e7/Architecture.png)
*Caption: High-level overview of Avatar Lab's components and data flow.*

---

## 🧱 Technology Stack

### Frontend
- ⚛️ **React.js (Next.js):** Component-based UI, SSR, and routing.
- 🎨 **CSS:** Utility-CSS  for rapid  styling.

### AI & Deep Learning
- 🧠 **Zonos TTS:** Chosen for its lightweight architecture and natural speech synthesis.
- 🧍‍♂️ **LatentSync:** Selected for superior lip-sync accuracy and realistic avatar animation.

### Backend
- 🌐 **FLASK:** Powers the REST API and orchestrates the animation pipeline.
- 🗂 **MongoDB:** NoSQL database for user data, animation metadata, and project configurations.

### Deployment & Infrastructure (Example)
- 🐳 **Docker:** Containerization for consistent environments.
- ☁️ **Vercel/Netlify:** For frontend deployment.
- ☁️ **AWS/Google Cloud/Azure:** For backend and AI model hosting (e.g., EC2, SageMaker, AI Platform).

---

## 🛠️ Workflow: From Text to Expressive Avatar

![Avatar Generation Workflow](https://github.com/project-info182/Avatar-Lab/blob/94b4663f4856a9e8b0cbef705152684d41c7a8ff/WorkFlow%20Final.png)
*Caption: Step-by-step process from user input to final animated avatar.*

1.  selects avatar/voice preferences and User inputs text/script.
2.  Backend sends text to **Zonos TTS** to generate expressive speech audio.
3.  The generated audio and chosen avatar template (or 3D model reference) are passed to **LatentSync**.
4.  LatentSync generates facial landmarks and renders the animated video.
5.  The final video is delivered to the user.

---

## ⚙️ Software Development Life Cycle (SDLC)

### Custom SDLC: Modified Waterfall with Parallel Model Integration for AI Pipelines

![SDLC Diagram](https://github.com/project-info182/Avatar-Lab/blob/main/SDLC.jpg)
*Caption: Our tailored SDLC approach balancing structured development with the iterative nature of AI model integration.*

This model allows for foundational planning (requirements, design) followed by parallel tracks for core software development and AI model research/integration, with feedback loops ensuring cohesion.

---

## 🔬 Models We Explored

*(This section is good as is, lists alternatives considered. No changes needed here unless you want to elaborate on *why* the chosen ones were superior for your specific needs in more detail than the "Models Chosen" section.)*

### 🗣️ Speech Synthesis Models
- [**Coqui TTS**](https://github.com/coqui-ai/TTS)
- [**Zonos TTS**](https://github.com/Zyphra/Zonos)
- [**Bark TTS**](https://github.com/suno-ai/bark)
- [**Spark TTS**](https://github.com/SparkAudio/Spark-TTS)

### 🎥 Diffusion-Based Facial Animation
- [**DiffPoseTalker**](https://github.com/DiffPoseTalk/DiffPoseTalk/tree/main)
- [**Memo Avatar**](https://github.com/memoavatar/memo.git)
- [**SadTalker**](https://github.com/OpenTalker/SadTalker)
- [**DiffTalk**](https://github.com/sstzal/DiffTalk)
- [**LatentSync**](https://github.com/bytedance/LatentSync)

---

## ✅ Models Chosen for Avatar Lab

After rigorous evaluation, we finalized the following for **Avatar Lab**:

### 🗣️ Speech Synthesis: [Zonos TTS](https://github.com/Zyphra/Zonos)
**Reasoning:** Zonos TTS was selected for its lightweight architecture, natural-sounding voice synthesis, and flexibility in customization, which allows for diverse and expressive vocal outputs.

🎧 **Sample Audio Output:**
[Listen to a Zonos TTS Sample (on GitHub Pages)](https://project-info182.github.io/Avatar-Lab/)
*(Consider linking directly to an audio file: e.g. `your-repo/docs/audio/zonos_sample.wav`)*

### 🎥 Facial Animation: [LatentSync](https://github.com/bytedance/LatentSync)
**Reasoning:** LatentSync demonstrated superior performance in generating highly realistic avatar animations with precise lip-sync accuracy and nuanced emotional expressions, crucial for our project's goals.

📹 **Sample Video Outputs:**

| Demo 1: Expressive Dialogue | Demo 2: Subtle Emotions |
| :-------------------------: | :---------------------: |
| <a href="https://project-info182.github.io/Avatar-Lab/video.html"><img src="https://raw.githubusercontent.com/project-info182/Avatar-Lab/main/thumbnail.png" alt="Watch Demo 1: Expressive Dialogue" width="280"/></a> | <a href="https://project-info182.github.io/Avatar-Lab/video1.html"><img src="https://raw.githubusercontent.com/project-info182/Avatar-Lab/main/thumbnail1.png" alt="Watch Demo 2: Subtle Emotions" width="280"/></a> |

---

## 🚀 Use Cases

Avatar Lab is ideal for enhancing applications in:
- 💬 **Virtual Assistants & Chatbots:** HR bots, customer support agents, smart help desks with a human touch.
- 🕹 **Gaming & Metaverse:** Immersive NPCs, AI-driven characters, personalized player avatars.
- 📚 **Education & E-Learning:** AI tutors, sign-language avatars, multilingual virtual teachers.
- 📹 **Content Creation & Marketing:** Automated video explainers, virtual influencers, localized video advertisements.
-  accessibility **Accessibility Tools:** Avatars for text-to-sign-language or for individuals needing communication aids.

---

## 🗺️ Project Milestones & Roadmap

### ✅ Completed Milestones
- **Core Model Selection:**
    - 🌐 Finalized **Zonos TTS** for speech synthesis.
    - 🎥 Finalized **LatentSync** for facial animation.
- **Prototyping & Foundation:**
    - 🖥️ Initial frontend structure designed with React.js and Tailwind CSS.
    - ⚙️ Core backend API developed using Node.js & Express.js.
    - 🔗 Proof-of-concept integration of TTS and facial animation models with the backend.

### 🚀 Current Focus & Next Steps
- [ ] **Full-Fledged Web Application:**
    - [ ✅ ] Develop a user-friendly interface for avatar generation (text input, audio upload, avatar selection).
    - [ ] Implement user accounts for saving projects and preferences.
- [ ] **API Enhancement & Documentation:**
    - [ ] Refine and document the REST API for third-party developer integration.
- [ ] **Advanced Features:**
    - [ ] Wider range of avatar customization options.
    - [ ] Control over emotional intensity and style.
    - [ ] Support for multiple languages.
- [ ] **Optimization & Scalability:**
    - [ ] Optimize model inference times and resource usage.
    - [ ] Enhance backend architecture for scalability and reliability.

### 🌟 Future Vision
- [ ] Real-time avatar interaction capabilities.
- [ ] Integration with VR/AR platforms.
- [ ] Community marketplace for avatars and voice models.

---

## 📈 Project Updates

-   **[Date -  2024-04-28]:** Resolved TTS integration issue (internal server error) by switching to URL-based access for audio templates, improving reliability.
-   **[Date -  2024-04-30]:** Core prototype functionality (text-to-speech-to-video pipeline) is complete. Shifting focus to frontend refinement, UX improvements, and comprehensive testing.
-   **[Date -  2024-04-10]:** Investigated running TTS and LatentSync models on a unified port. Encountered dependency conflicts; currently sticking to running models on different ports

---

## 🤝 Contribute or Collaborate

We’re building something exciting—and you can be part of it! We welcome contributions of all kinds, from code and documentation to ideas and feedback.

**How to Contribute:**
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/YourAmazingFeature`).
5.  Open a Pull Request.

Please read our `CONTRIBUTING.md` (you'll need to create this file!) for more details on our code style, testing, and development process.

For major changes, please open an issue first to discuss what you would like to change.

---

## 👥 Contributors

A big thank you to all our contributors:

- [**Shashank Reddy Y**](https://github.com/Shashank-Reddy-Y)
- [**Naveen Chandra Kanth**](https://github.com/NaveenCK-10)
- [**Satvik V**](https://github.com/satvik2106)
- [**Aditi**](https://github.com/Aditi500-ace)
- [**Monisha Sarai**](https://github.com/monishasarai)
- [**Spandana**](https://github.com/Span1531)
- [**Vajra Chaitanya**](https://github.com/Vajra-Chaitanya)

---

**Let’s make avatars *feel* human.**
Welcome to the future of expressive AI.
