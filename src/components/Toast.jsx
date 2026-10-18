import { useStore } from '../store/AppStore.jsx';
import Icon from './Icon.jsx';
import './Toast.css';

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast && (
        <div key={toast.key} className={`toast toast--${toast.tone}`}>
          <Icon name={toast.tone === 'error' ? 'close' : 'check'} size={18} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
