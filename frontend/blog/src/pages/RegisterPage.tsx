import { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function registerUser() {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API;

      const res = await fetch(`${apiUrl}/author/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <HeaderComponent />

      <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={onChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={onChange}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Strong Password"
          value={form.password}
          onChange={onChange}
        />

        <button onClick={registerUser} disabled={loading}>
          {loading ? "Sending..." : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
}
