import { useState } from "react";
import { loginUser } from "../api/auth.api";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);

      // backend devuelve { user, token }
      login(data);

      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{ color: "white", padding: 20 }}>
      <h1>Login</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10,
            background: "#111",
            color: "white",
            border: "1px solid #333",
            borderRadius: 6,
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 10,
            background: "#111",
            color: "white",
            border: "1px solid #333",
            borderRadius: 6,
          }}
        />

        <button
          type="submit"
          style={{
            padding: 10,
            background: "#333",
            color: "white",
            border: "1px solid #444",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Ingresar
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      <p style={{ marginTop: 10 }}>
        ¿No tenés cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </div>
  );
}