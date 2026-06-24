import { useState } from "react";

export default function RegisterPage() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      usuario,
      email,
      clave,
    });
  };

  return (
    <div>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <button type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
}