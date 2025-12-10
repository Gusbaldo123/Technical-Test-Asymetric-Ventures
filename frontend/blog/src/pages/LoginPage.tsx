import { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  }

  const { login } = useAuth();

  async function postUser() {
    const ok = await login(credentials.email, credentials.password);
    if (ok) window.location.href = "/home";
  }

  return (
    <>
      <HeaderComponent key={"header"} />

      <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          value={credentials.email}
          onChange={onChange}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Strong Password"
          value={credentials.password}
          onChange={onChange}
        />

        <button onClick={postUser} disabled={loading}>
          {loading ? "Enviando..." : "Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

    </>
  );
}
