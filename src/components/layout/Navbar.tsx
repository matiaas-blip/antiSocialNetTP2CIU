import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: "12px 20px",
    borderRadius: "16px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#b0b0b0",
    background: isActive ? "#2b2b2b" : "transparent",
    transition: "0.2s ease",
    fontWeight: 500,
  });

  return (
    <nav
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",

        display: "flex",
        alignItems: "center",
        gap: "10px",

        padding: "10px",

        background: "rgba(25, 25, 25, 0.85)",
        backdropFilter: "blur(12px)",

        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",

        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

        zIndex: 1000,
      }}
    >
      <NavLink to="/" style={linkStyle}>
        Home
      </NavLink>

      <NavLink to="/create" style={linkStyle}>
        Publicar
      </NavLink>

      <NavLink to="/profile" style={linkStyle}>
        Perfil
      </NavLink>

      <NavLink to="/login" style={linkStyle}>
        Login
      </NavLink>
    </nav>
  );
}