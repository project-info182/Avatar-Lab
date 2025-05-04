import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './VideoOutput.css';

const VideoOutput = () => {
  const location = useLocation();
  const history = useHistory();
  const { videoTemplate, audioTemplate, transcript, audioUrl, videoUrl } = location.state || {};

  if (!videoTemplate || !audioTemplate || !transcript || !videoUrl) {
    history.push('/template-select');
    return null;
  }

  return (
    <div className="video-output-page">
      <h2>🎉 Your Talking Head Video Is Ready!</h2>

      <div className="output-container">
        <div className="template-preview">
          <img src={videoTemplate.imageUrl} alt={videoTemplate.name} />
          <audio controls>
            <source src={audioUrl || audioTemplate.audioUrl} type="audio/wav" />
          </audio>
          <p><strong>{videoTemplate.name}</strong></p>
        </div>

        <div className="transcript-block">
          <h3>📝 Transcript</h3>
          <p>{transcript}</p>
        </div>

        <div className="video-block">
          <h3>📹 Generated Video</h3>
          <video width="480" height="280" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <button className="restart-btn" onClick={() => history.push('/templates')}>
        Generate Another Video
      </button>
    </div>
  );
};

export default VideoOutput;
