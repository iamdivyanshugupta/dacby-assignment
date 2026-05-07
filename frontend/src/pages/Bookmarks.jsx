import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://dacby-assignment-fzq2.onrender.com';

const Bookmarks = () => {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const [storiesRes, userRes] = await Promise.all([
        axios.get(`${API}/api/stories`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const userBookmarks = userRes.data.bookmarks || userRes.data.data?.bookmarks || [];
      const bookmarkedIds = userBookmarks.map(id => id.toString());
      const storiesArray = storiesRes.data.stories || storiesRes.data.data || [];
      setBookmarks(storiesArray.filter(story => bookmarkedIds.includes(story._id.toString())));
    } catch (err) {
      setError(`Failed to fetch bookmarks: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (storyId) => {
    setRemoving(prev => ({ ...prev, [storyId]: true }));
    try {
      await axios.post(
        `${API}/api/stories/${storyId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks(prev => prev.filter(s => s._id !== storyId));
    } catch (err) {
      alert(`Failed to remove bookmark: ${err.response?.data?.message || err.message}`);
    } finally {
      setRemoving(prev => ({ ...prev, [storyId]: false }));
    }
  };

  if (loading) return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <div style={{ ...styles.skBlock, width: '200px', height: '32px', marginBottom: '8px' }} className="skeleton" />
          <div style={{ ...styles.skBlock, width: '140px', height: '16px' }} className="skeleton" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ ...styles.card, marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...styles.skBlock, width: '75%', height: '20px', marginBottom: '10px' }} className="skeleton" />
              <div style={{ ...styles.skBlock, width: '45%', height: '14px' }} className="skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div style={styles.pageWrapper}>
      <div style={styles.centeredBox}>
        <span style={styles.bigIcon}>⚠️</span>
        <p style={styles.errorText}>{error}</p>
        <button onClick={fetchBookmarks} style={styles.retryBtn}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerSection}>
          <h1 style={styles.heading}>
            <span>🔖</span> My Bookmarks
          </h1>
          <p style={styles.subheading}>
            {bookmarks.length > 0
              ? `${bookmarks.length} saved ${bookmarks.length === 1 ? 'story' : 'stories'}`
              : 'Your saved stories will appear here'}
          </p>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📌</div>
            <h3 style={styles.emptyTitle}>No bookmarks yet</h3>
            <p style={styles.emptyText}>Go to the home page and save your favourite stories!</p>
            <a href="/" style={styles.goHomeBtn}>Browse Stories →</a>
          </div>
        ) : (
          <div style={styles.storiesList}>
            {bookmarks.map((story, index) => (
              <div
                key={story._id}
                style={styles.card}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Rank */}
                <div style={styles.rankBadge}>
                  <span style={styles.rankNum}>{index + 1}</span>
                </div>

                <div style={styles.content}>
                  <a
                    href={story.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.title}
                    onMouseEnter={e => e.target.style.color = '#ff6314'}
                    onMouseLeave={e => e.target.style.color = '#f0f0f5'}
                  >
                    {story.title}
                  </a>

                  {story.url && (
                    <span style={styles.domain}>
                      {(() => { try { return new URL(story.url).hostname.replace('www.', ''); } catch { return ''; } })()}
                    </span>
                  )}

                  <div style={styles.meta}>
                    <span style={styles.metaItem}>
                      <span style={styles.metaIcon}>▲</span>
                      <strong style={{ color: '#ff6314' }}>{story.points}</strong> pts
                    </span>
                    <span style={styles.metaDot}>·</span>
                    <span style={styles.metaItem}>👤 {story.author}</span>
                    <span style={styles.metaDot}>·</span>
                    <span style={styles.metaItem}>🕐 {story.postedAt}</span>

                    <button
                      onClick={() => handleRemoveBookmark(story._id)}
                      disabled={removing[story._id]}
                      style={styles.removeBtn}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(220,38,38,0.15)';
                        e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)';
                        e.currentTarget.style.color = '#f87171';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = '#5a5a72';
                      }}
                    >
                      {removing[story._id] ? '...' : '✕ Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: 'calc(100vh - 64px)',
    background: 'linear-gradient(180deg, #0f0f13 0%, #12121a 100%)',
    paddingBottom: '60px',
  },
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '36px 20px',
  },
  headerSection: {
    marginBottom: '32px',
  },
  heading: {
    fontSize: 'clamp(22px, 4vw, 30px)',
    fontWeight: '800',
    color: '#f0f0f5',
    letterSpacing: '-0.5px',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  subheading: {
    fontSize: '14px',
    color: '#5a5a72',
  },
  storiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    background: '#1a1a24',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '18px 20px',
    transition: 'all 0.2s ease',
  },
  rankBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,99,20,0.1)',
    border: '1px solid rgba(255,99,20,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  rankNum: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ff6314',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    fontWeight: '600',
    color: '#f0f0f5',
    display: 'block',
    marginBottom: '6px',
    lineHeight: '1.5',
    transition: 'color 0.2s',
    wordBreak: 'break-word',
  },
  domain: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '500',
    color: '#5a5a72',
    background: 'rgba(255,255,255,0.04)',
    padding: '2px 8px',
    borderRadius: '4px',
    marginBottom: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    fontSize: '12px',
    color: '#5a5a72',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#5a5a72',
  },
  metaIcon: {
    color: '#ff6314',
    fontSize: '10px',
  },
  metaDot: {
    color: '#3a3a50',
  },
  removeBtn: {
    marginLeft: 'auto',
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#5a5a72',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    background: '#1a1a24',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    textAlign: 'center',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f0f0f5',
  },
  emptyText: {
    fontSize: '14px',
    color: '#5a5a72',
    maxWidth: '300px',
  },
  goHomeBtn: {
    marginTop: '8px',
    display: 'inline-block',
    background: 'linear-gradient(135deg, #ff6314, #ff8c55)',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(255,99,20,0.3)',
  },
  centeredBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  bigIcon: { fontSize: '40px' },
  errorText: { fontSize: '15px', color: '#9898b0', textAlign: 'center', maxWidth: '400px' },
  retryBtn: {
    background: 'linear-gradient(135deg, #ff6314, #ff8c55)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  skBlock: { display: 'block' },
};

export default Bookmarks;