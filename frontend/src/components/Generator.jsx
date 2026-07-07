import { useState } from 'react';
import { imageAPI } from '../api';
import './Generator.css';

export default function Generator({ onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError('');
    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data } = await imageAPI.generate(prompt.trim());
      console.log('API Response:', data);
      console.log('Image data:', data.image);
      setGeneratedImage(data.image);
      onImageGenerated?.(data.image);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator fade-in">
      <div className="generator-header">
        <h2>Generate Image</h2>
        <p>Describe what you want to see and AI will create it</p>
      </div>

      <form onSubmit={handleGenerate} className="generator-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A futuristic city at sunset with flying cars..."
          rows={4}
          disabled={loading}
        />
        <button type="submit" className="btn-primary generate-btn" disabled={loading || !prompt.trim()}>
          {loading ? (
            <>
              <span className="spinner" />
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {loading && (
        <div className="loading-state">
          <div className="loading-animation">
            <div className="spinner" style={{ width: 48, height: 48 }} />
          </div>
          <p>Creating your image... This may take a moment.</p>
        </div>
      )}

      {generatedImage && !loading && (
        <div className="result fade-in">
          <img 
            src={generatedImage.image_url} 
            alt={generatedImage.prompt}
            onError={(e) => {
              console.error('Image failed to load:', generatedImage.image_url);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
          />
          <div className="result-info">
            <p className="result-prompt">{generatedImage.prompt}</p>
            <a
              href={generatedImage.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Open Full Size
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
