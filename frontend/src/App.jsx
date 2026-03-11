import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './app.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !email) {
      setStatus('error');
      setMessage('Please provide both a file and an email address.');
      return;
    }

    const formData = new FormData();
    formData.append('data', file);
    formData.append('email', email);

    setStatus('loading');
    setMessage('Processing data and generating insights...');

    try {
      // Use the deployed Render backend API endpoint
      const response = await axios.post('https://rabbitai-uzsu.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus('success');
      setMessage(response.data.message || 'Insights generated and sent successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'An error occurred during processing.');
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <div className="logo-box">
            <span className="logo-icon">🐰</span>
          </div>
          <h1>Sales Insight Automator</h1>
          <p>Instantly distill Q1 sales data into actionable executive briefs.</p>
        </header>

        <form onSubmit={handleSubmit} className="upload-form">
          <div 
            className={`file-upload-zone ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="file-input" 
              accept=".csv, .xlsx" 
              onChange={handleFileChange}
              className="hidden-input"
            />
            <label htmlFor="file-input" className="upload-label">
              <FiUploadCloud className="upload-icon" />
              <span className="upload-text">
                {file ? file.name : "Drag & drop your CSV/Excel file or click to browse"}
              </span>
            </label>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Executive email address (e.g., leadership@rabbit.ai)"
                required
                className="email-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${status === 'loading' ? 'loading' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Generating Insights...' : 'Generate & Send Brief'}
          </button>
        </form>

        {status !== 'idle' && (
          <div className={`status-message ${status}`}>
            {status === 'success' && <FiCheckCircle className="status-icon" />}
            {status === 'error' && <FiAlertCircle className="status-icon" />}
            {status === 'loading' && <div className="spinner"></div>}
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
