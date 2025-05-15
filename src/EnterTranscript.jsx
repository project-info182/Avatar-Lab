import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './EnterTranscript.css'; // Import the CSS for styling UI elements

const EnterTranscript = () => {
  const location = useLocation();
  const history = useHistory();
  const { videoTemplate, audioTemplate } = location.state || {};

  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const backgroundContainerRef = useRef(null);

  useEffect(() => {
    if (!videoTemplate?.name || !audioTemplate?.audioUrl) {
      console.warn("Template data missing or incomplete, redirecting.");
      if (history) {
        const timer = setTimeout(() => {
          history.push('/templates');
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      setStatus('Template loaded. Enter transcript.');
    }
  }, [videoTemplate, audioTemplate, history]);

  // --- 2D Canvas Shooting Stars Background Effect (remains unchanged) ---
  useEffect(() => {
    const currentContainer = backgroundContainerRef.current;
    if (!currentContainer) {
      console.error("Background container ref is not available.");
      return;
    }

    const canvas = document.createElement('canvas');
    currentContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.style.pointerEvents = 'none'; 

    let width, height;
    const particles = [];
    const particleCount = 150;
    const minInitialSpeedY = 2;
    const maxInitialSpeedY = 6;
    const minInitialSpeedX = -1;
    const maxInitialSpeedX = 1;
    const minSize = 1;
    const maxSize = 3.5;
    const minFadeRate = 0.005;
    const maxFadeRate = 0.015;
    const glowBlur = 5;

    let animationFrameId;

    class Particle {
      constructor() {
        this.reset();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fadeRate;
        if (this.alpha <= 0 || this.y > height + this.size || this.x < -this.size || this.x > width + this.size) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * (currentContainer?.clientWidth || window.innerWidth);
        this.y = -this.size - Math.random() * (currentContainer?.clientHeight || window.innerHeight) * 0.5;
        this.vx = Math.random() * (maxInitialSpeedX - minInitialSpeedX) + minInitialSpeedX;
        this.vy = Math.random() * (maxInitialSpeedY - minInitialSpeedY) + minInitialSpeedY;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.alpha = 0.5 + Math.random() * 0.5;
        this.fadeRate = Math.random() * (maxFadeRate - minFadeRate) + minFadeRate;
        const hue = Math.random() * 360;
        const saturation = 70 + Math.random() * 30;
        const lightness = 60 + Math.random() * 25;
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const colorMatch = this.color.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
        if (colorMatch) {
          const [, h, s, l] = colorMatch;
          ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${this.alpha})`;
          ctx.shadowColor = `hsla(${h}, ${s}%, ${l}%, ${this.alpha * 0.8})`;
        } else {
          ctx.fillStyle = `hsla(0, 0%, 100%, ${this.alpha})`;
          ctx.shadowColor = `hsla(0, 0%, 100%, ${this.alpha * 0.8})`;
        }
        ctx.shadowBlur = glowBlur;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function createParticles() {
      if (!width || !height) return;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    function resizeCanvas() {
      width = canvas.width = currentContainer.clientWidth;
      height = canvas.height = currentContainer.clientHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.display = 'block';
      createParticles();
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(10, 10, 26, 0.12)';
      ctx.fillRect(0, 0, width, height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
    }

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentContainer && canvas.parentNode === currentContainer) {
        currentContainer.removeChild(canvas);
      }
      particles.length = 0;
    };
  }, [backgroundContainerRef]);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      alert('Please enter a transcript!');
      return;
    }
    if (isGenerating) {
      console.log("Already generating, ignoring click.");
      return;
    }

    setIsGenerating(true);
    setProgressPercentage(0); // Initial progress
    setStatus('Starting video generation process...');
    setError(null);

    const backendUrl = 'http://localhost:8000';
    const LatentSyncUrl = 'http://localhost:6900';

    try {
      setProgressPercentage(5); // Progress: TTS about to start
      setStatus('Generating speech from transcript...');
      const fullAudioUrl = `${window.location.origin}${audioTemplate.audioUrl}`;
      const ttsResponse = await fetch(`${backendUrl}/api/generate_speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,
          speaker_audio_path: fullAudioUrl,
          language: 'en-us'
        }),
      });

      if (!ttsResponse.ok) {
        const errorData = await ttsResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `TTS generation failed with status: ${ttsResponse.status}`);
      }

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setProgressPercentage(30); // Progress: TTS completed
      setStatus('Speech audio generated successfully');

      setProgressPercentage(35); // Progress: Template video fetching about to start
      setStatus('Fetching template video file...');
      const fullVideoUrl = `${window.location.origin}${videoTemplate.imageUrl}`;
      const videoResponse = await fetch(fullVideoUrl);
      if (!videoResponse.ok) throw new Error(`Failed to fetch template video with status: ${videoResponse.status}`);

      const videoBlob = await videoResponse.blob();
      setProgressPercentage(40); // Progress: Template video fetched
      setStatus('Template video file fetched successfully');

      setProgressPercentage(45); // Progress: Lip-sync generation about to start
      setStatus('Generating lip-synced video (this may take a minute)...');
      const formData = new FormData();
      formData.append('video', new File([videoBlob], videoTemplate.name || 'template_video.mp4', { type: videoBlob.type }));
      formData.append('audio', new File([audioBlob], 'speech_audio.wav', { type: audioBlob.type || 'audio/wav' }));

      const latentSyncResponse = await fetch(`${LatentSyncUrl}/api/lipsync`, {
        method: 'POST',
        body: formData,
      });

      if (!latentSyncResponse.ok) {
        const errorData = await latentSyncResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `LatentSync video generation failed with status: ${latentSyncResponse.status}`);
      }

      const finalVideoBlob = await latentSyncResponse.blob();
      const finalVideoUrl = URL.createObjectURL(finalVideoBlob);
      setProgressPercentage(95); // Progress: Lip-sync completed
      setStatus('Video generated successfully!');

      history.push('/video-output', {
        videoTemplate,
        audioTemplate,
        transcript,
        generatedAudioUrl: audioUrl,
        generatedVideoUrl: finalVideoUrl,
      });

    } catch (fetchError) {
      console.error('Generation error:', fetchError);
      setError(fetchError.message || 'Failed to generate video. Please try again.');
      setStatus('Generation failed');
      setProgressPercentage(0); // Reset progress on error
    } finally {
      if (!error && status === 'Video generated successfully!') {
        setProgressPercentage(100);
      }

      setTimeout(() => {
        setIsGenerating(false);
        if (!error && status === 'Video generated successfully!') {
          setStatus('Ready');
        }
      }, 2000);
    }
  };

  const backgroundContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    overflow: 'hidden',
  };

  if (!videoTemplate?.name || !audioTemplate?.audioUrl) {
    return (
      <div className="transcript-page dark" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
        <div ref={backgroundContainerRef} style={backgroundContainerStyle}></div>
        <div className="background-overlay" style={{ zIndex: 1 }}></div>
        <p className="loading-text" style={{ fontSize: '1.2rem', color: 'var(--dark-text-secondary)', zIndex: 2 }}>
          Loading template data or redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="transcript-page dark">
      <div ref={backgroundContainerRef} style={backgroundContainerStyle}>
        {/* 2D Canvas will be appended here */}
      </div>
      <div className="background-overlay" style={{ zIndex: 1 }}></div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
        <h2 className="page-title">Enter Your Transcript</h2>

        {!isGenerating && (
          <div className="template-preview glassmorphism">
            <video
              key={videoTemplate.imageUrl}
              src={videoTemplate.imageUrl}
              width="300"
              muted
              autoPlay
              poster={videoTemplate.posterUrl || "/assets/placeholder_video.jpg"}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <p><strong>{videoTemplate.name}</strong></p>
            <audio controls key={audioTemplate.audioUrl}>
              <source src={audioTemplate.audioUrl} type={`audio/${audioTemplate.audioUrl.split('.').pop()}`} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <textarea
          className="transcript-input glassmorphism"
          placeholder="Type or paste your script here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          aria-label="Transcript input"
          disabled={isGenerating}
        />
        <button
          className="generate-btn styled-button"
          onClick={handleGenerate}
          disabled={!transcript.trim() || isGenerating}
        >
          <span>{isGenerating ? 'Generating...' : 'Generate Talking Head Video'}</span>
        </button>

        {isGenerating && (
          <div className="processing-container glassmorphism">
            <div className="loader">⏳ {status} - {progressPercentage}%</div>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${progressPercentage}%`, animation: 'none' }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message glassmorphism">
            <p>❌ Error: {error}</p>
            <p>Please try again or check your backend services.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterTranscript;
