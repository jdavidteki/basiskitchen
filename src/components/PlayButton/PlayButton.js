import React from 'react';

import './PlayButton.css';

const PlayButton = (props) => {
  return (
    <div className="PlayButton-wrapper">
      <div
        className="PlayButton-circle pulse"
        style={props.audioPlaying ? { animation: 'pulse 0.5s infinite'} : {}}
      >
      </div>
      <div className="PlayButton-circle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <polygon points="40,30 65,50 40,70"></polygon>
      </svg>
      </div>
    </div>
  )
}

export default PlayButton;