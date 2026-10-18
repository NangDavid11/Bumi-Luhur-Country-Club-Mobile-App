import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useStore } from '../store/AppStore.jsx';
import './Header.css';

/* Top bar used on every screen: avatar or back button, a title (the
   Bumi Luhur logo on Home), and the notification bell or a custom action. */
export default function Header({ title, logo = false, back = false, onBack, right }) {
  const navigate = useNavigate();
  const { user, unread } = useStore();

  const goBack = () => {
    if (onBack) return onBack();
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <header className="hdr">
      {back ? (
        <button className="round-btn" type="button" onClick={goBack} aria-label="Back">
          <Icon name="back" width={15.3} height={13.7} />
        </button>
      ) : (
        <Link to="/profile" className="hdr__avatar" aria-label="My profile">
          <img src={user.avatar} alt="" width="48" height="48" />
        </Link>
      )}

      <div className="hdr__title">
        {logo ? (
          <h1 className="hdr__logo"><Icon name="logo" width={141} height={37.5} label="Bumi Luhur Country Club" /></h1>
        ) : (
          <h1 className="display-title">{title}</h1>
        )}
      </div>

      {right ?? (
        <Link to="/notifications" className="round-btn" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}>
          <Icon name="bell" width={21.6} height={22.6} />
          {unread > 0 && <span className="hdr__dot" aria-hidden="true" />}
        </Link>
      )}
    </header>
  );
}
