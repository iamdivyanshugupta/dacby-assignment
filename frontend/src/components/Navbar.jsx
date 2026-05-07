import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>🔥</span>
          <span style={styles.brandText}>HN<span style={styles.brandAccent}>Reader</span></span>
        </Link>

        {/* Desktop Nav */}
        <div style={styles.desktopLinks}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>
            <span>Stories</span>
            {isActive('/') && <span style={styles.linkDot} />}
          </Link>
          {user && (
            <Link to="/bookmarks" style={{ ...styles.link, ...(isActive('/bookmarks') ? styles.linkActive : {}) }}>
              <span>Bookmarks</span>
              {isActive('/bookmarks') && <span style={styles.linkDot} />}
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div style={styles.authSection}>
          {user ? (
            <>
              <span style={styles.username}>
                <span style={styles.avatarCircle}>{user.username?.[0]?.toUpperCase()}</span>
                <span style={styles.usernameText}>{user.username}</span>
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...styles.hamburgerLine, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.hamburgerLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Stories</Link>
          {user ? (
            <>
              <Link to="/bookmarks" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Bookmarks</Link>
              <span style={styles.mobileSep} />
              <span style={styles.mobileUsername}>{user.username}</span>
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(15, 15, 19, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  navInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  brandIcon: {
    fontSize: '22px',
  },
  brandText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#f0f0f5',
    letterSpacing: '-0.5px',
  },
  brandAccent: {
    color: '#ff6314',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '@media (max-width: 640px)': { display: 'none' },
  },
  link: {
    color: '#9898b0',
    fontSize: '14px',
    fontWeight: '500',
    padding: '6px 14px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',
    textDecoration: 'none',
  },
  linkActive: {
    color: '#f0f0f5',
    background: 'rgba(255,255,255,0.06)',
  },
  linkDot: {
    position: 'absolute',
    bottom: '-2px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#ff6314',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  username: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatarCircle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6314, #ff8c55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    flexShrink: 0,
  },
  usernameText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#9898b0',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#9898b0',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loginBtn: {
    color: '#9898b0',
    fontSize: '14px',
    fontWeight: '500',
    padding: '6px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #ff6314, #ff8c55)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    padding: '7px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    boxShadow: '0 2px 12px rgba(255,99,20,0.3)',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  hamburgerLine: {
    display: 'block',
    width: '22px',
    height: '2px',
    background: '#f0f0f5',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 20px 20px',
    gap: '4px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(15,15,19,0.98)',
  },
  mobileLink: {
    color: '#9898b0',
    fontSize: '15px',
    fontWeight: '500',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
  },
  mobileSep: {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '6px 0',
  },
  mobileUsername: {
    color: '#5a5a72',
    fontSize: '13px',
    padding: '4px 12px',
  },
  mobileLogout: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#9898b0',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    textAlign: 'left',
    marginTop: '4px',
  },
};

export default Navbar;