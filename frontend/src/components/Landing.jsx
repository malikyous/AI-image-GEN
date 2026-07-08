import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎨',
      title: 'AI-Powered Generation',
      description: 'Transform your ideas into stunning images using advanced AI technology'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Generate high-quality images in seconds with our optimized pipeline'
    },
    {
      icon: '💾',
      title: 'History & Storage',
      description: 'All your creations are automatically saved and accessible anytime'
    },
    {
      icon: '🎯',
      title: 'Easy to Use',
      description: 'Simple interface - just describe what you want and let AI do the magic'
    }
  ];

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-text">AI Image Generator</span>
        </div>
        <div className="landing-nav-buttons">
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Create Stunning Images with AI
          </h1>
          <p className="hero-subtitle">
            Transform your imagination into reality. Describe your vision and watch as AI brings it to life in seconds.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary hero-btn" onClick={() => navigate('/register')}>
              Start Creating Free
            </button>
            <button className="btn-secondary hero-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-placeholder">
            <div className="hero-gradient"></div>
            <div className="hero-float-1"></div>
            <div className="hero-float-2"></div>
            <div className="hero-float-3"></div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="features-title">Why Choose Us?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card fade-in">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Create?</h2>
          <p className="cta-subtitle">
            Join thousands of creators using AI to bring their ideas to life
          </p>
          <button className="btn-primary cta-btn" onClick={() => navigate('/register')}>
            Get Started Now
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 AI Image Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
