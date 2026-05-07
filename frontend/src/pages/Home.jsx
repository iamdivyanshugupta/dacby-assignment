import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://dacby-assignment-fzq2.onrender.com';

const Home = () => {
  const { user, token } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const [bookmarkLoading, setBookmarkLoading] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStories();
  }, [page]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/api/stories?page=${page}&limit=10`);
      setStories(res.data.stories || res.data.data || []);
      setTotalPages(res.data.pagination?.pages || res.data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (storyId) => {
    if (!user) {
      alert('Please login to bookmark stories');
      return;
    }
    setBookmarkLoading(prev => ({ ...prev, [storyId]: true }));
    try {
      const res = await axios.post(
        `${API}/api/stories/${storyId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const isBookmarked = res.data.bookmarked !== undefined
        ? res.data.bookmarked
        : res.data.data?.bookmarked !== undefined
          ? res.data.data.bookmarked
          : !bookmarked[storyId];
      setBookmarked(prev => ({ ...prev, [storyId]: isBookmarked }));
    } catch (err) {
      alert(`Failed to toggle bookmark: ${err.response?.data?.message || err.message}`);
    } finally {
      setBookmarkLoading(prev => ({ ...prev, [storyId]: false }));
    }
  };

  if (loading) return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <div style={{ ...styles.skeletonBlock, width: '260px', height: '32px', marginBottom: '8px' }} className="skeleton" />
          <div style={{ ...styles.skeletonBlock, width: '180px', height: '18px' }} className="skeleton" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ ...styles.card, marginBottom: '12px' }}>
            <div style={{ ...styles.skeletonBlock, width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} className="skeleton" />
            <div style={{ flex: 1 }}>
              <div style={{ ...styles.skeletonBlock, width: '80%', height: '20px', marginBottom: '10px' }} className="skeleton" />
              <div style={{ ...styles.skeletonBlock, width: '50%', height: '14px' }} className="skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div style={styles.pageWrapper}>
      <div style={styles.errorBox}>
        <span style={styles.errorIcon}>⚠️</span>
        <p style={styles.errorText}>{error}</p>
        <button onClick={fetchStories} style={styles.retryBtn}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerSection}>
          <h1 style={styles.heading}>
            <span style={styles.headingIcon}>🔥</span> Top Stories
          </h1>
          <p style={styles.subheading}>Scraped live from Hacker News · Sorted by points</p>
        </div>

        {/* Stories */}
        <div style={styles.storiesList}>
          {stories.map((story, index) => {
            const rank = (page - 1) * 10 + index + 1;
            const isBookmarked = bookmarked[story._id];
            const isLoading = bookmarkLoading[story._id];
            return (
              <div
                key={story._id}
                style={styles.card}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Rank Badge */}
                <div style={styles.rankBadge}>
                  <span style={styles.rankNum}>{rank}</span>
                </div>

                {/* Content */}
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

                  {/* Domain chip */}
                  {story.url && (
                    <span style={styles.domain}>
                      {(() => { try { return new URL(story.url).hostname.replace('www.', ''); } catch { return ''; } })()}
                    </span>
                  )}

                  {/* Meta */}
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
                      onClick={() => handleBookmark(story._id)}
                      style={{
                        ...styles.bookmarkBtn,
                        background: isBookmarked
                          ? 'linear-gradient(135deg, #ff6314, #ff8c55)'
                          : 'rgba(255,255,255,0.05)',
                        color: isBookmarked ? 'white' : '#9898b0',
                        border: isBookmarked ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? '...' : isBookmarked ? '🔖 Saved' : '+ Save'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            onClick={() => { setPage(p => Math.max(p - 1, 1)); window.scrollTo(0, 0); }}
            disabled={page === 1}
            style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span style={styles.pageInfo}>
            Page <strong style={{ color: '#ff6314' }}>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => { setPage(p => Math.min(p + 1, totalPages)); window.scrollTo(0, 0); }}
            disabled={page === totalPages}
            style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
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
  headingIcon: {
    fontSize: '26px',
  },
  subheading: {
    fontSize: '14px',
    color: '#5a5a72',
    fontWeight: '400',
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
    cursor: 'default',
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
  bookmarkBtn: {
    marginLeft: 'auto',
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
    boxShadow: 'none',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '40px',
  },
  pageBtn: {
    background: '#1a1a24',
    color: '#f0f0f5',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#5a5a72',
    minWidth: '120px',
    textAlign: 'center',
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  errorIcon: {
    fontSize: '40px',
  },
  errorText: {
    fontSize: '16px',
    color: '#9898b0',
  },
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
  skeletonBlock: {
    display: 'block',
  },
};

export default Home;