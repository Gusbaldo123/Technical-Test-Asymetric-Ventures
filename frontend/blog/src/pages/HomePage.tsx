import { useState, useEffect } from 'react'
import type { Post } from '../models/Post';

import HeaderComponent from '../components/HeaderComponent';
import PostComponent from '../components/PostComponent';

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPosts() {
    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API;

      const url = `${apiUrl}/post`;

      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          "size":"20",
          "page":"0"
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setPosts(data);

    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <HeaderComponent key={"header"} />
      <div>
        {posts.map((post) => (
          <PostComponent key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

export default HomePage;