import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, token } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStories();
  }, [page]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://dacby-assignment-fzq2.onrender.com/api/stories?page=${page}&limit=10`
      );
      setStories(res.data.stories);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      setError('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (storyId) => {
    if (!user) {
      alert('Please login to bookmark stories');
      return;
    }
    try {
      const res = await axios.post(
        `https://dacby-assignment-fzq2.onrender.com/api/stories/${storyId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarked((prev) => ({
        ...prev,
        [storyId]: res.data.bookmarked,
      }));
    } catch (err) {
      alert('Failed to toggle bookmark');
    }
  };

  if (loading) return <div style={styles.center}>Loading stories...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Top Hacker News Stories</h2>
      {stories.map((story, index) => (
        <div key={story._id} style={styles.card}>
          <div style={styles.rank}>{(page - 1) * 10 + index + 1}</div>
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
                onClick={() => handleBookmark(story._id)}
                style={{
                  ...styles.bookmarkBtn,
                  backgroundColor: bookmarked[story._id] ? '#ff6600' : 'transparent',
                  color: bookmarked[story._id] ? 'white' : '#ff6600',
                }}
              >
                {bookmarked[story._id] ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div style={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={styles.pageBtn}
        >
          Prev
        </button>
        <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>
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
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  rank: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#999',
    minWidth: '32px',
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
  bookmarkBtn: {
    border: '1px solid #ff6600',
    padding: '3px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    marginBottom: '24px',
  },
  pageBtn: {
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666',
  },
  center: {
    textAlign: 'center',
    marginTop: '48px',
    fontSize: '16px',
  },
};

export default Home;