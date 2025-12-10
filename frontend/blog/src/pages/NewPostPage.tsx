import { useState, useEffect } from 'react'
import type { Category } from '../models/Category';
import type { Post } from '../models/Post';
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../context/AuthContext'
import type { Author } from '../models/Author';
import { useNavigate } from 'react-router-dom';

function NewPostPage() {
  const { author } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const api = import.meta.env.VITE_API;
  const token = author?.session?.replaceAll('"', '');
  const navigate = useNavigate();

  useEffect(() => {
    if (!author) return;
    fetchCategories();
  }, [author]);

  if (!author) {
    window.confirm("Please, log in");
    navigate("/home");
  }

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await fetch(`${api}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = Number(e.target.value);
    if (!value) return;
    const category = categories.find(c => c.id === value);
    if (!category) return;
    setSelectedCategories(prev => [...prev, category]);
    setCategories(prev => prev.filter(c => c.id !== value));
    e.target.value = "";
  }

  function removeSelected(cat: Category) {
    setCategories(prev => [...prev, cat]);
    setSelectedCategories(prev => prev.filter(c => c.id !== cat.id));
  }

  async function sendPost() {
    if (!author) {
      window.confirm("Please, log in");
      navigate("/home");
      return;
    }
    const post = {
      title:title.trim(),
      content:content.trim(),
      categoryIds: selectedCategories.map(c => c.id),
    }
    if (!post) return;
    const res = await fetch(`${api}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(post)
    });
    if(res.ok)
      navigate("/home");
  }

  if (!author) return <div>Loading user...</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <HeaderComponent key={"header"} />
      <div style={{ padding: "20px" }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />

        <h3>Select categories</h3>
        <select onChange={handleSelect} defaultValue="">
          <option value="">-</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <h3 style={{ marginTop: "20px" }}>Selected Categories</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {selectedCategories.length === 0 && <span>No category selected</span>}
          {selectedCategories.map(cat => (
            <button key={cat.id} onClick={() => removeSelected(cat)}>
              {cat.name} X
            </button>
          ))}
        </div>
        <button onClick={sendPost}>Post</button>
      </div>
    </>
  );
}

export default NewPostPage;
