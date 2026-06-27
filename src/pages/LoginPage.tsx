import { useState } from "react";
import { loginUser } from "../api/auth.api";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(email, password);

      login(data);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white p-6">
      
      {/* GLOW BACKGROUND */}
      <div className="absolute w-[400px] h-[400px] bg-blue-600/30 blur-3xl rounded-full" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Acceso al sistema
        </h1>

        <p className="text-sm text-gray-400 text-center">
          Ingresá al archivo social restringido
        </p>

        {/* EMAIL */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-blue-500 outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="p-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-blue-500 outline-none"
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
            bg-gradient-to-r from-blue-500 to-purple-500
            hover:opacity-90 active:scale-[0.98]
            transition disabled:opacity-50
          "
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <Link
          to="/register"
          className="text-center text-sm text-gray-400 hover:text-white transition"
        >
          ¿No tenés cuenta? Crear acceso →
        </Link>
      </form>
    </div>
  );
}