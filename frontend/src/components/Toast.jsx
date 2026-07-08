import { useToast } from '../context/ToastContext';
import './Toast.css';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} fade-in`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close">×</button>
        </div>
      ))}
    </div>
  );
}
