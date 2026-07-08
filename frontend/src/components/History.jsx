import { useState, useEffect, useCallback } from 'react';
import { imageAPI } from '../api';
import { useToast } from '../context/ToastContext';
import './History.css';

export default function History({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await imageAPI.getHistory(page);
      setImages(data.images);
      setTotalPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history');
      addToast(err.response?.data?.error || 'Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, addToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from history?')) return;

    try {
      await imageAPI.deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      addToast('Image deleted successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  if (loading) {
    return (
      <div className="history-loading">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="history fade-in">
      <div className="history-header">
        <h2>Your History</h2>
        <p>All images you've generated</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {images.length === 0 ? (
        <div className="history-empty">
          <p>No images yet. Generate your first one!</p>
        </div>
      ) : (
        <>
          <div className="history-grid">
            {images.map((img) => (
              <div key={img.id} className="history-card">
                <img src={img.image_url} alt={img.prompt} loading="lazy" />
                <div className="history-card-info">
                  <p className="history-prompt">{img.prompt}</p>
                  <span className="history-date">
                    {new Date(img.created_at).toLocaleDateString()}
                  </span>
                  <div className="history-actions">
                    <a
                      href={img.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      View
                    </a>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(img.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                className="btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
