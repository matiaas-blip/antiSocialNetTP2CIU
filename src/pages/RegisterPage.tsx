import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/register.api";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await registerUser({
        usuario,
        email,
        clave,
      });

      login(user);
      navigate("/");
    } catch (err: any) {
      const message = err?.response?.data?.error;

      if (!message) {
        setError("No se pudo registrar el usuario");
        return;
      }

      if (message.includes("duplicate")) {
        if (message.includes("usuario")) {
          setError("El nombre de usuario ya está en uso");
        } else if (message.includes("email")) {
          setError("El email ya está registrado");
        } else {
          setError("Usuario o email ya existe");
        }
        return;
      }

      setError(message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 400,
          background: "#1b1b1b",
          padding: 30,
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <h1>Registro</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div style={{ color: "#ff6b6b", fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            background: "#2a2a2a",
            color: "white",
            border: "none",
            padding: 12,
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          Registrarse
        </button>

        <Link
          to="/login"
          style={{
            textDecoration: "none",
            textAlign: "center",
            background: "#222",
            color: "white",
            padding: 12,
            borderRadius: 14,
            display: "block",
          }}
        >
          Iniciar sesión
        </Link>
      </form>
    </div>
  );
}

const inputStyle = {
  background: "#222",
  border: "none",
  padding: "12px",
  borderRadius: "12px",
  color: "white",
  outline: "none",
};