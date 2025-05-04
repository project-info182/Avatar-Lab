import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './EnterTranscript.css';

const EnterTranscript = () => {
  const location = useLocation();
  const history = useHistory(); 
  const { videoTemplate, audioTemplate } = location.state || {};

  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoTemplate || !audioTemplate) {
      history.push('/templates');
    }
  }, [videoTemplate, audioTemplate, history]);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      alert('Please enter a transcript!');
      return;
    }

    setIsGenerating(true);
    setStatus('Starting video generation process...');
    setError(null);

    const backendUrl = 'http://localhost:8000';
    const LatentSyncUrl='http://localhost:6900'

    try {
      // Step 1: Generate speech audio
      setStatus('Generating speech from transcript...');
      const fullAudioUrl = `${window.location.origin}${audioTemplate.audioUrl}`
      const ttsResponse = await fetch(`${backendUrl}/api/generate_speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,              // Send the transcript text
          speaker_audio_path: fullAudioUrl,  // Send the speaker audio path
          language: 'en-us'               // Use the appropriate language
        }),
      });

      if (!ttsResponse.ok) {
        const errorData = await ttsResponse.json();
        throw new Error(errorData.message || 'TTS generation failed');
      }

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setStatus('Speech audio generated successfully');

      // Step 2: Fetch template video file
      setStatus('Fetching template video file...');
      const videoResponse = await fetch(videoTemplate.imageUrl); // Still using imageUrl for consistency
      if (!videoResponse.ok) throw new Error('Failed to fetch template video');

      const videoBlob = await videoResponse.blob();
      setStatus('Template video file fetched successfully');

      // Step 3: Send files to LatentSync API
      const formData = new FormData();
      formData.append('video', new File([videoBlob], 'template_video.mp4', { type: videoBlob.type }));
      formData.append('audio', new File([audioBlob], 'speech.wav', { type: audioBlob.type }));

      setStatus('Generating lip-synced video (this may take a minute)...');
      const latentSyncResponse = await fetch(`${LatentSyncUrl}/api/lipsync`, {
        method: 'POST',
        body: formData,
      });

      if (!latentSyncResponse.ok) {
        const errorData = await latentSyncResponse.json();
        throw new Error(errorData.message || 'LatentSync video generation failed');
      }

      const finalVideoBlob = await latentSyncResponse.blob();
      const finalVideoUrl = URL.createObjectURL(finalVideoBlob);
      setStatus('Video generated successfully!');

      // Navigate to video output page
      history.push('/video-output', {
        videoTemplate,
        audioTemplate,
        transcript,
        audioUrl,
        videoUrl: finalVideoUrl,
      });
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message || 'Failed to generate video. Please try again.');
      setStatus('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!videoTemplate || !audioTemplate) {
    return <p>Loading template data...</p>;
  }

  return (
    <div className="transcript-page">
      <h2>Enter Your Transcript</h2>

      <div className="template-preview">
        <video
          src={videoTemplate.imageUrl}
          width="300"
          controls
          muted
          playsInline
          poster="/assets/demo1_video.mp4" 
        />
        <p><strong>{videoTemplate.name}</strong></p>
        <audio controls>
          <source src={audioTemplate.audioUrl} type={`audio/${audioTemplate.audioUrl.split('.').pop()}`} />
          Your browser does not support the audio element.
        </audio>
      </div>

      <textarea
        placeholder="Type your transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        aria-label="Transcript input"
      />

      <button
        className="generate-btn"
        onClick={handleGenerate}
        disabled={!transcript.trim() || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Talking Head Video'}
      </button>

      {isGenerating && (
        <div className="processing-container">
          <div className="loader">⏳ {status}</div>
          <div className="progress-bar">
            <div className="progress-bar-inner"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <p>Please try again or use a different template.</p>
        </div>
      )}
    </div>
  );
};

export default EnterTranscript;
