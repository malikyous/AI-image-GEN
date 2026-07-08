import { useState } from 'react';
import { imageAPI } from '../api';
import { useToast } from '../context/ToastContext';
import './Generator.css';

const PROMPT_SUGGESTIONS = [
  'A futuristic city at sunset with flying cars',
  'A magical forest with glowing mushrooms and fireflies',
  'An astronaut riding a horse on Mars',
  'A cozy coffee shop in a rainy cyberpunk street',
  'A majestic dragon sleeping on a treasure mountain',
  'A serene Japanese garden with cherry blossoms',
  'A steampunk airship flying through clouds',
  'A underwater kingdom with mermaids and coral castles'
];

export default function Generator({ onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError('');
    setLoading(true);
    setGeneratedImage(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const { data } = await imageAPI.generate(prompt.trim());
      setGeneratedImage(data.image);
      onImageGenerated?.(data.image);
      addToast('Image generated successfully!', 'success');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to generate image');
      addToast(err.response?.data?.error || 'Failed to generate image', 'error');
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage.image_url;
    link.download = `ai-generated-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Image downloaded!', 'success');
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
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
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
      )}

      {!loading && !generatedImage && (
        <div className="prompt-suggestions">
          <p className="suggestions-title">Try these prompts:</p>
          <div className="suggestions-grid">
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
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
            <div className="result-actions">
              <button className="btn-primary" onClick={handleDownload}>
                Download
              </button>
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
        </div>
      )}
    </div>
  );
}
