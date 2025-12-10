import { useState } from "react";
import type { Author } from "../models/Author";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function EditForm({ targetAuthor }: { targetAuthor: Author }) {
  const { author } = useAuth();
  const [form, setForm] = useState({
    name: targetAuthor.name,
    email: targetAuthor.email,
    role: targetAuthor.role,
    password: ""
  });
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function updateAuthor() {
    try {
      setSaving(true);
      setMessage(null);
      if (!author) return;

      const obj = {
        name: form.name,
        email: form.email,
        password: form.password
      }
      const res = await fetch(`${apiUrl}/author/${targetAuthor.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${author.session?.replaceAll("\"", "")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
      });

      if (!res.ok) {
        setMessage("Erro ao atualizar.");
        return;
      }

      setMessage("Atualizado com sucesso.");
    } catch (e) {
      setMessage("Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAuthor() {
    if (!author) return;

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`${apiUrl}/author/${targetAuthor.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${author.session?.replaceAll("\"", "")}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) {
          setMessage("Error on delete");
          return;
        }

        window.confirm("Deleted successfuly");
        navigate("/home");
      } catch (error) {
        setMessage("Unexpected error.")
      }
      finally {
        setSaving(false);
      }
    }
  }

  return (
    <div style={{ marginTop: "30px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Editar Perfil</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <label>Nome</label>
        <input type="text" name="name" value={form.name} onChange={onChange} />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} />

        <button onClick={updateAuthor} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>

        {message && <p>{message}</p>}
      </div>
      <button onClick={deleteAuthor}>Delete author</button>
    </div>
  );
}

export default EditForm;