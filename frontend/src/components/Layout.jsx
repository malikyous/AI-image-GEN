import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children, activeTab, onTabChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-text">AI Image Generator</span>
        </div>

        <div className="navbar-tabs">
          <button
            className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => onTabChange('generate')}
          >
            Generate
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => onTabChange('history')}
          >
            History
          </button>
        </div>

        <div className="navbar-user">
          <span className="username">{user?.username}</span>
          <button className="btn-secondary logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
