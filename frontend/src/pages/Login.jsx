import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://dacby-assignment-fzq2.onrender.com';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, formData);
      const userData = res.data.user || res.data.data?.user;
      const tokenData = res.data.token || res.data.data?.token;
      login(userData, tokenData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🔥</span>
          <h1 style={styles.logoText}>HN<span style={styles.logoAccent}>Reader</span></h1>
        </div>

        <h2 style={styles.heading}>Welcome back</h2>
        <p style={styles.subheading}>Sign in to your account to continue</p>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              id="login-email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              style={{
                ...styles.input,
                borderColor: focused === 'email' ? '#ff6314' : 'rgba(255,255,255,0.08)',
                boxShadow: focused === 'email' ? '0 0 0 3px rgba(255,99,20,0.15)' : 'none',
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              id="login-password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              style={{
                ...styles.input,
                borderColor: focused === 'password' ? '#ff6314' : 'rgba(255,255,255,0.08)',
                boxShadow: focused === 'password' ? '0 0 0 3px rgba(255,99,20,0.15)' : 'none',
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span style={styles.loadingRow}>
                <span style={styles.spinner} /> Signing in...
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.footerLink}>Create one free</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,99,20,0.08) 0%, #0f0f13 60%)',
    padding: '24px 16px',
  },
  card: {
    background: '#1a1a24',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    animation: 'fadeInUp 0.4s ease',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '28px',
  },
  logoIcon: { fontSize: '26px' },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#f0f0f5',
    letterSpacing: '-0.5px',
  },
  logoAccent: { color: '#ff6314' },
  heading: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f0f0f5',
    textAlign: 'center',
    marginBottom: '6px',
  },
  subheading: {
    fontSize: '14px',
    color: '#5a5a72',
    textAlign: 'center',
    marginBottom: '28px',
  },
  errorBox: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.25)',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#9898b0',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#f0f0f5',
    outline: 'none',
    transition: 'all 0.2s',
    width: '100%',
  },
  submitBtn: {
    marginTop: '6px',
    background: 'linear-gradient(135deg, #ff6314, #ff8c55)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 20px rgba(255,99,20,0.35)',
    letterSpacing: '0.2px',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#5a5a72',
  },
  footerLink: {
    color: '#ff6314',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Login;