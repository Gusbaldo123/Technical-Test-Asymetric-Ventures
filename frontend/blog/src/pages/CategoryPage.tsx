import { useState, useEffect } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Category = {
    id: number;
    name: string;
};

export default function CategoryPage() {
    const { author } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const api = import.meta.env.VITE_API;
    const token = author?.session?.replaceAll('"', '');

    useEffect(() => {
        if (!author) return;
        if (author.role.toLowerCase() !== "administrator") {
            navigate("/home");
            return;
        }
        fetchCategories();
    }, [author]);

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

    async function createCategory() {
        if (!newName.trim()) return;
        await fetch(`${api}/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: newName })
        });
        setNewName("");
        fetchCategories();
    }

    async function updateCategory(id: number) {
        if (!editName.trim()) return;
        await fetch(`${api}/category/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: editName })
        });
        setEditId(null);
        setEditName("");
        fetchCategories();
    }

    async function deleteCategory(id: number) {
        await fetch(`${api}/category/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        fetchCategories();
    }

    if (!author) return <div>Loading user...</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <HeaderComponent />

            <div style={{ padding: "20px" }}>
                <h2>Category Manager</h2>

                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="New category"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button onClick={createCategory}>Create</button>
                </div>

                {categories.map((cat) => (
                    <div key={cat.id} style={{ marginBottom: "10px" }}>
                        {editId === cat.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <button onClick={() => updateCategory(cat.id)}>Save</button>
                                <button onClick={() => { setEditId(null); setEditName(""); }}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{cat.name}</span>
                                <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}>Edit</button>
                                <button onClick={() => deleteCategory(cat.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}