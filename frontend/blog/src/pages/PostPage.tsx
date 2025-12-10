import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../models/Post';
import type { Category } from '../models/Category';

export default function PostPage() {
  const { author } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { postId } = useParams<{ postId: string }>();

  const canEdit =
    author &&
    (
      author.role?.toLowerCase() === "administrator" ||
      author.id === post?.author?.id
    );

  async function handleDelete() {
    if (!post) return;
    const apiUrl = import.meta.env.VITE_API;
    await fetch(`${apiUrl}/post/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${author?.session?.replaceAll('"', '')}`,
      },
    });
    navigate("/home");
  }

  async function handleSave() {
    if (!post) return;
    const apiUrl = import.meta.env.VITE_API;
    await fetch(`${apiUrl}/post/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${author?.session?.replaceAll('"', '')}`,
      },
      body: JSON.stringify({
        title,
        content,
        categoryIds: selectedCategories
      }),
    });
    navigate(0);
  }

  function toggleCategory(id: number) {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    if (!postId) return;
    const id = parseInt(postId);

    async function load() {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API;

        const p = await fetch(`${apiUrl}/post/${id}`);
        const pdata = await p.json();

        const c = await fetch(`${apiUrl}/category`);
        const cdata = await c.json();

        setPost(pdata);
        setTitle(pdata.title);
        setContent(pdata.content);
        setAllCategories(cdata);
        setSelectedCategories(pdata.categories.map((c: Category) => c.id));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [postId]);

  if (!postId) return null;
  if (loading) return <div>Loading...</div>;
  if (!post) return <h3>Post not found</h3>;

  return (
    <>
      <HeaderComponent />

      {!editing && (
        <div>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.categories.map(cat => (
            <p key={cat.id}>{cat.name}</p>
          ))}

          {canEdit && (
            <div>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}

      {editing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <textarea value={content} onChange={e => setContent(e.target.value)} />

          <h4>Categories</h4>
          {allCategories.map(cat => (
            <label key={cat.id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}

          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}
