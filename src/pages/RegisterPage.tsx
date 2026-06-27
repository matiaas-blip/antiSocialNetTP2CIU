import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/register.api";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || !email || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = await registerUser({
        usuario,
        email,
        password,
      });

      login(user);
      navigate("/");
    } catch (err: any) {
      const message = err?.response?.data?.error;

      if (!message) {
        setError("No se pudo registrar el usuario");
      } else if (message.includes("duplicate")) {
        if (message.includes("usuario")) {
          setError("El nombre de usuario ya está en uso");
        } else if (message.includes("email")) {
          setError("El email ya está registrado");
        } else {
          setError("Usuario o email ya existe");
        }
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white p-6">
      
      {/* GLOW BACKGROUND */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/30 blur-3xl rounded-full" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Crear cuenta
        </h1>

        <p className="text-sm text-gray-400 text-center">
          Accedé al sistema de archivo social
        </p>

        {/* USER */}
        <input
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuario"
          className="p-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-purple-500 outline-none"
        />

        {/* EMAIL */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-purple-500 outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="p-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-purple-500 outline-none"
        />

        {/* ERROR */}
        {error && (
          <div className="text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="
            w-full py-3 rounded-xl font-semibold
            bg-gradient-to-r from-purple-500 to-blue-500
            hover:opacity-90 active:scale-[0.98]
            transition disabled:opacity-50
          "
        >
          {loading ? "Creando cuenta..." : "Registrar usuario"}
        </button>

        <Link
          to="/login"
          className="text-center text-sm text-gray-400 hover:text-white transition"
        >
          Ya tengo cuenta → Iniciar sesión
        </Link>
      </form>
    </div>
  );
}