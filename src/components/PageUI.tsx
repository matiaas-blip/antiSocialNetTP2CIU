import  ReactNode  from "react";

/* =========================
   PAGE WRAPPER
========================= */

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>{children}</div>
    </div>
  );
}

/* =========================
   GLASS CARD
========================= */

export function GlassCard({
  children,
  onClick,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: any;
}) {
  return (
    <div onClick={onClick} style={{ ...styles.card, ...style }}>
      {children}
    </div>
  );
}

/* =========================
   GLASS BUTTON
========================= */

export function GlassButton({
  children,
  onClick,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.button,
        background: danger
          ? "rgba(255,80,80,0.15)"
          : "rgba(255,255,255,0.06)",
        color: danger ? "#ff6b6b" : "white",
      }}
    >
      {children}
    </button>
  );
}

export function Sidebar({ navigate }: any) {
  return (
    <div style={sidebarStyles.container}>
      <h2 style={{ margin: 0 }}>AntiSocial</h2>

      <button style={sidebarStyles.btn} onClick={() => navigate("/")}>
        🏠 Feed
      </button>

      <button style={sidebarStyles.btn} onClick={() => navigate("/create")}>
        ✍️ Crear post
      </button>

      <button style={sidebarStyles.btn} onClick={() => navigate("/profile")}>
        👤 Perfil
      </button>
    </div>
  );
}

/* =========================
   STYLES SYSTEM
========================= */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1a1a1a, #0a0a0a)",
    display: "flex",
    justifyContent: "center",
    padding: 20,
    color: "white",
  },

  container: {
    width: "100%",
    maxWidth: 1100,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    transition: "0.2s",
  },

  button: {
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },
};

const sidebarStyles = {
  container: {
    position: "fixed",
    left: 20,
    top: 20,
    width: 180,
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    height: "calc(100vh - 40px)",
  },

  btn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    padding: 10,
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "left",
  },
};

