// app/video-output/page.jsx (or similar route)
"use client"; // ** REQUIRED for hooks like useState, useEffect, useRef, useLocation, useHistory **

import React, { useEffect, useState } from 'react'; // Added useState
import { useLocation, useHistory } from 'react-router-dom';
import './VideoOutput.css'; // Adjust path if needed

const VideoOutput = () => {
  // Get state passed from the previous page (EnterTranscript)
  const location = useLocation();
  const history = useHistory();
  // Destructure state, providing default empty object to avoid errors if state is null
  const { videoTemplate, audioTemplate, transcript, audioUrl, videoUrl } = location.state || {};

  // State to trigger entrance animations after data is loaded and component mounts
  const [showContent, setShowContent] = useState(false);

  // Effect to check for required data and trigger animations
  useEffect(() => {
    // Check if all necessary data is present
    if (!videoTemplate || !audioTemplate || !transcript || !videoUrl) {
      console.warn("Missing video output data, redirecting.");
      // Redirect to template selection if data is missing
      history.push('/templates'); // Changed to '/templates' as per previous flow
    } else {
      // If data is present, set showContent to true to trigger animations
      setShowContent(true);
    }
  }, [videoTemplate, audioTemplate, transcript, videoUrl, history]); // Dependencies for the effect

  // If data is missing and redirecting, render nothing or a loading state
  if (!showContent) {
    return (
       <div className="video-output-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
         <p style={{ fontSize: '1.2rem', color: '#a09cb8' }}>
           Loading video data or redirecting...
         </p>
       </div>
    );
  }

  // If data is present, render the video output content
  return (
    // Apply 'video-output-page' class
    <div className="video-output-page">
      {/* Page Title */}
      <h2>🎉 Your Talking Head Video Is Ready!</h2>

      {/* Main Output Container - Add 'loaded' class to trigger animations */}
      <div className={`output-container ${showContent ? 'loaded' : ''}`}>
        {/* Template Preview Block */}
        <div className="template-preview">
          {/* Template Image */}
          {videoTemplate?.imageUrl && ( // Optional chaining for safety
             <img src={videoTemplate.imageUrl} alt={videoTemplate.name || 'Template image'} />
          )}
          {/* Original Audio Preview */}
          {(audioUrl || audioTemplate?.audioUrl) && ( // Use generated audio first, fallback to template audio
             <audio controls>
               <source src={audioUrl || audioTemplate.audioUrl} type={`audio/${(audioUrl || audioTemplate.audioUrl).split('.').pop() || 'wav'}`} /> {/* Dynamically set type */}
               Your browser does not support the audio element.
             </audio>
          )}
          {/* Template Name */}
          {videoTemplate?.name && <p><strong>{videoTemplate.name}</strong></p>}
        </div>

        {/* Transcript Block */}
        <div className="transcript-block">
          <h3>📝 Transcript</h3>
          <p>{transcript}</p>
        </div>

        {/* Generated Video Block */}
        <div className="video-block">
          <h3>📹 Generated Video</h3>
          {videoUrl && ( // Only render video tag if videoUrl exists
             <video width="100%" height="auto" controls> {/* Use 100% width and auto height */}
               <source src={videoUrl} type="video/mp4" /> {/* Assuming mp4 output */}
               Your browser does not support the video tag.
             </video>
          )}
        </div>
      </div>

      {/* Restart Button */}
      <button className="restart-btn" onClick={() => history.push('/templates')}>
        Generate Another Video
      </button>
    </div>
  );
};

export default VideoOutput;
