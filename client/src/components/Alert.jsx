import React, { useState, useEffect } from 'react';
import '../styles/Alert.css';

const Alert = ({ message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide down animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const icon = type === 'error' ? '❌' : '✅';

  return (
    <div className={`alert-container ${isVisible ? 'show' : ''}`}>
      <div className={`alert-box ${type}`}>
        <span className="alert-icon">{icon}</span>
        <span className="alert-message">{message}</span>
        <button className="alert-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;