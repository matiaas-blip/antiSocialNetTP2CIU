import { useState } from "react";
import { loginUser } from "../api/auth.api";
import  useAuth  from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(usuario, clave);

      login(user); // 🔥 guarda sesión real

      navigate("/"); // redirige al home
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{ color: "white" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Link to="/register" style={{ color: "lightblue" }}>
        Crear cuenta
      </Link>
    </div>
  );
}