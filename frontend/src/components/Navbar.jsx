import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.brand}>
        HackerNews Reader
      </Link>
      <div style={styles.links}>
        <Link to='/' style={styles.link}>Stories</Link>
        {user ? (
          <>
            <Link to='/bookmarks' style={styles.link}>Bookmarks</Link>
            <span style={styles.username}>Hi, {user.username}</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login' style={styles.link}>Login</Link>
            <Link to='/register' style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#ff6600',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    color: 'white',
    fontSize: '14px',
  },
  username: {
    color: 'white',
    fontSize: '14px',
  },
  button: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '4px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
  },
};

export default Navbar;