import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './TemplateSelect.css'; // Ensure this file contains the CSS below

const templates = [
  {
    id: 'template1',
    name: 'Person A',
    imageUrl: '/assets/demo1_video.mp4', // UPDATE PATH
    audioUrl: '/assets/demo1.wav',       // UPDATE PATH
    posterUrl: '/assets/poster1.jpg'     // Optional Poster: UPDATE PATH
  },
  {
    id: 'template2',
    name: 'Person B',
    imageUrl: '/assets/demo2_video.mp4', // UPDATE PATH
    audioUrl: '/assets/demo2.wav',       // UPDATE PATH
    posterUrl: '/assets/poster2.jpg'     // Optional Poster: UPDATE PATH
  },
  {
    id: 'template3',
    name: 'Person C',
    imageUrl: '/assets/demo3.mp4',       // UPDATE PATH
    audioUrl: '/assets/demo3.wav',       // UPDATE PATH
    posterUrl: '/assets/poster3.jpg'     // Optional Poster: UPDATE PATH
  },
  {
    id: 'template4',
    name: 'Person D',
    imageUrl: '/assets/spokesman.mp4',       // UPDATE PATH
    audioUrl: '/assets/bark_output_2.wav',       // UPDATE PATH
    posterUrl: '/assets/poster4.jpg'     // Optional Poster: UPDATE PATH
  },
  // Add more templates as needed
];

const TemplateSelect = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const history = useHistory();

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleConfirm = () => {
    if (!selectedTemplate) {
      alert('Please select a template before continuing.');
      return;
    }

    history.push('/enter-transcript', {
      videoTemplate: selectedTemplate,
      audioTemplate: selectedTemplate,
    });
  };

  return (
    // Added class for potential future theme toggling alignment
    <div className="template-select-page dark">
      {/* Animated gradient background applied via CSS */}
      <div className="background-overlay"></div> {/* Optional overlay div */}

      {/* Updated Title */}
      <h2 className="page-title">Select Avatar Template</h2>

      <div className="template-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            // Added glassmorphism class
            className={`template-card glassmorphism ${selectedTemplateId === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplateId(template.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedTemplateId === template.id}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTemplateId(template.id); }} // Basic keyboard accessibility
          >
            <div className="card-media-wrapper">
              <video
                src={template.imageUrl}
                width="100%"
                height="100%" // Fill wrapper
                muted
                loop
                playsInline
                autoPlay
                poster={template.posterUrl || "/assets/placeholder_video.jpg"} // UPDATE PATH
                preload="metadata"
                className="template-video-preview"
              />
              <div className="media-overlay"></div>
            </div>
            <div className="template-info">
              <p>{template.name}</p>
              <audio controls key={template.audioUrl}>
                <source
                  src={template.audioUrl}
                  type={`audio/${template.audioUrl.split('.').pop()}`}
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        ))}
      </div>

      <button
        className="confirm-btn"
        onClick={handleConfirm}
        disabled={!selectedTemplateId}
      >
        <span>Confirm Selection & Proceed</span>
      </button>
    </div>
  );
};

export default TemplateSelect;
