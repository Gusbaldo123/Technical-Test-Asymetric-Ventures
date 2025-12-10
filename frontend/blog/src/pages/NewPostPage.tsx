import { useState } from 'react'
import type { Category } from '../models/Category';
import type { Post } from '../models/Post';
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../context/AuthContext'
import type { Author } from '../models/Author';

function NewPostPage() {
  const { author } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "name" },
    { id: 2, name: "test" }
  ]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  if (!author) {
    window.confirm("Please, log in");
    window.location.href = "/home";
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

  function sendPost() {
    if (!author) {
      window.confirm("Please, log in");
      window.location.href = "/home";
      return;
    }
    const post: Post = {
      id: 0,
      author: author,
      title,
      content,
      categories: selectedCategories
    }
  }

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
