import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [isLightMode, setIsLightMode] = useState(false);
    const toggleTheme = () => {
        setIsLightMode(!isLightMode);
      };
  return (
    <div className={`homepage ${isLightMode ? 'light' : 'dark'}`}>
         <button className="theme-toggle" onClick={toggleTheme}>
             {isLightMode ? 'Dark' : 'Light'} Mode
        </button>
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero">
        <h1>🎤 TalkHead AI</h1>
        <p>Create realistic talking head videos using just an image, audio, and your script.</p>
        <a href="/templates" className="cta-button">Try It Now</a>
      </header>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Choose a Face</h3>
            <p>Select from our image templates to use as the speaking avatar.</p>
          </div>
          <div className="step">
            <h3>2. Pick a Voice</h3>
            <p>Choose a matching voice for your video from our audio samples.</p>
          </div>
          <div className="step">
            <h3>3. Enter Text</h3>
            <p>Write the script you'd like the avatar to say. We'll generate the video for you!</p>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      {/* Templates Preview */}
<section className="templates-preview">
  <h2>Templates Preview</h2>
  <div className="template-gallery">
    <div className="template">
      <img
        src="https://images.pexels.com/photos/1181412/pexels-photo-1181412.jpeg?auto=compress&cs=tinysrgb&h=350"
        alt="Person A"
      />
      <p>Person A</p>
    </div>
    <div className="template">
      <img
        src="https://images.pexels.com/photos/1181413/pexels-photo-1181413.jpeg?auto=compress&cs=tinysrgb&h=350"
        alt="Person B"
      />
      <p>Person B</p>
    </div>
    <div className="template">
        <audio controls>
            <source src="demo1_audio.wav" type="audio/wav" />
            Your browser does not support the audio element.
        </audio>
        <p>Voice A</p>
        </div>

        <div className="template">
        <audio controls>
            <source src="demo2_audio.wav" type="audio/wav" />
            Your browser does not support the audio element.
        </audio>
        <p>Voice B</p>
    </div>

  </div>
</section>


      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} TalkHead AI • Built with ❤️</p>
      </footer>
    </div>
    </div>
  );
};

export default HomePage;
