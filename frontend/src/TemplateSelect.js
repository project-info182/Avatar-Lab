import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './TemplateSelect.css';

const templates = [
  {
    id: 'template1',
    name: 'Person A',
    imageUrl: '/assets/demo1_video.mp4',
    audioUrl: '/assets/demo1.wav',
  },
  {
    id: 'template2',
    name: 'Person B',
    imageUrl: '/assets/demo2_video.mp4',
    audioUrl: '/assets/demo2.wav',
  },
  {
    id: 'template3',
    name: 'Person C',
    imageUrl: '/assets/demo3.mp4',
    audioUrl: '/assets/demo3.wav',
  },
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
    <div className="template-select-page">
      <h2>Select a Talking Head Template</h2>
      <div className="template-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplateId === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplateId(template.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedTemplateId === template.id}
          >
            <video
              src={template.imageUrl}
              width="200"
              height="auto"
              muted
              loop
              playsInline
              autoPlay // Optional: remove if you don't want autoplay
              poster="/assets/placeholder.jpg" // Optional: fallback image
            />
            <div className="template-info">
              <p>{template.name}</p>
              <audio controls>
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
        Confirm Selection
      </button>
    </div>
  );
};

export default TemplateSelect;
