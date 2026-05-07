import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Bookmarks = () => {
  const { user, token } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'https://dacby-backend.onrender.com/api/stories',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter only bookmarked stories by checking user bookmarks
      const userRes = await axios.get(
        'https://dacby-backend.onrender.com/api/auth/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookmarkedIds = userRes.data.bookmarks.map((id) => id.toString());
      const storiesArray = res.data.stories || res.data.data || [];
      const bookmarkedStories = storiesArray.filter((story) =>
        bookmarkedIds.includes(story._id.toString())
      );

      setBookmarks(bookmarkedStories);
    } catch (err) {
      setError('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (storyId) => {
    try {
      await axios.post(
        `https://dacby-backend.onrender.com/api/stories/${storyId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks((prev) => prev.filter((s) => s._id !== storyId));
    } catch (err) {
      alert('Failed to remove bookmark');
    }
  };

  if (loading) return <div style={styles.center}>Loading bookmarks...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <div style={styles.empty}>
          No bookmarks yet. Go bookmark some stories!
        </div>
      ) : (
        bookmarks.map((story) => (
          <div key={story._id} style={styles.card}>
            <div style={styles.content}>
              <a href={story.url || '#'}
                target="_blank"
                rel="noreferrer"
                style={styles.title}
              >
                {story.title}
              </a>
              <div style={styles.meta}>
                <span>{story.points} points</span>
                <span>{story.author}</span>
                <span>{story.postedAt}</span>
                <button
                  onClick={() => handleRemoveBookmark(story._id)}
                  style={styles.removeBtn}
                >
                  Remove Bookmark
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '24px auto',
    padding: '0 16px',
  },
  heading: {
    fontSize: '22px',
    marginBottom: '16px',
    color: '#ff6600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    display: 'block',
    marginBottom: '8px',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    fontSize: '13px',
    color: '#666',
    flexWrap: 'wrap',
  },
  removeBtn: {
    border: '1px solid #cc0000',
    padding: '3px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    backgroundColor: 'transparent',
    color: '#cc0000',
  },
  empty: {
    textAlign: 'center',
    marginTop: '48px',
    fontSize: '16px',
    color: '#666',
  },
  center: {
    textAlign: 'center',
    marginTop: '48px',
    fontSize: '16px',
  },
};

export default Bookmarks;