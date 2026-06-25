import { useEffect, useState, useCallback } from "react";
import { getUserById, getAllUsers } from "../api/users.api";
import { getPostsByUser } from "../api/posts.api";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import songIcon from "../assets/icons/song.svg";

/* =========================
   STORAGE (POR USUARIO)
========================= */

const PROFILE_STORAGE_KEY = (userId: string) =>
  `antisocial_profile_${userId}`;

const profileStorage = {
  get: (userId: string) =>
    JSON.parse(
      localStorage.getItem(PROFILE_STORAGE_KEY(userId)) || "null"
    ),

  set: (userId: string, data: any) =>
    localStorage.setItem(
      PROFILE_STORAGE_KEY(userId),
      JSON.stringify(data)
    ),
};

/* =========================
   HOOK MOBILE (igual idea tuya)
========================= */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

/* =========================
   COMPONENTE
========================= */

export default function ProfileLayout() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useIsMobile();

  const userId = authUser?._id;

  const [finalUser, setFinalUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [editData, setEditData] = useState({
    descripcion: "",
    fotoPerfil: "",
    fondoPerfil: "",
    canciones: [] as string[],
  });

  /* =========================
     HELPERS
  ========================= */

  const updateField = (field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     EFFECT
  ========================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          navigate("/login");
          return;
        }

        const [userData, usersData, postsData] = await Promise.all([
          getUserById(userId),
          getAllUsers(),
          getPostsByUser(userId),
        ]);

        const local = profileStorage.get(userId);

        // 🔥 MERGE SEGURO (NO rompe login)
        const merged = {
          ...userData,
          descripcion: local?.descripcion ?? userData.descripcion ?? "",
          fotoPerfil: local?.fotoPerfil ?? userData.fotoPerfil ?? "",
          fondoPerfil: local?.fondoPerfil ?? userData.fondoPerfil ?? "",
          canciones: local?.canciones ?? userData.canciones ?? [],
        };

        setFinalUser(merged);
        setAllUsers(usersData);
        setPosts(postsData);

        setEditData({
          descripcion: merged.descripcion,
          fotoPerfil: merged.fotoPerfil,
          fondoPerfil: merged.fondoPerfil,
          canciones: merged.canciones,
        });
      } catch (err) {
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, location.key]);

  /* =========================
     SAVE PROFILE
  ========================= */

  const saveProfile = async () => {
    const updated = {
      ...finalUser,
      ...editData,
    };

    setFinalUser(updated);
    setEditing(false);

    profileStorage.set(userId, updated);

    await api.put(`/users/${userId}/profile`, editData);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* =========================
     ESTILOS (TU MISMO DISEÑO)
  ========================= */

  const container = {
    width: "100%",
    maxWidth: "1100px",
    background: "rgba(15,15,15,0.92)",
    borderRadius: "24px",
    padding: isMobile ? 15 : 30,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const header = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: 20,
    alignItems: "center",
    textAlign: isMobile ? "center" : "left",
    background: "#1f1f1f",
    padding: 20,
    borderRadius: 16,
  };

  const avatar = {
    width: isMobile ? 90 : 120,
    height: isMobile ? 90 : 120,
    borderRadius: 18,
    objectFit: "cover",
  };

  const split = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: 15,
  };

  const card = {
    background: "#1f1f1f",
    padding: 15,
    borderRadius: 14,
    flex: 1,
    color: "#bdbdbd",
  };

  const btn = {
    background: "#555",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    width: isMobile ? "100%" : "auto",
  };

  const input = {
    width: "100%",
    padding: 10,
    background: "#424242",
    border: "none",
    color: "white",
    borderRadius: 10,
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: 10,
  };

  const post = {
    aspectRatio: "1/1",
    background: "#2b2b2b",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "0.2s",
  };

  const labelStyle = {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    display: "block",
    letterSpacing: 0.5,
  };

  const editInput = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#151515",
    color: "white",
    outline: "none",
  };

  const textarea = {
    width: "100%",
    minHeight: 90,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#151515",
    color: "white",
    outline: "none",
    resize: "vertical",
  };

  const songRow = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 10px",
    borderRadius: 10,
    background: "#141414",
    border: "1px solid rgba(255,255,255,0.05)",
  };

  const songInput = {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    outline: "none",
  };

  const deleteBtn = {
    background: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
  };

  const addBtn = {
    marginTop: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    padding: "10px",
    borderRadius: 12,
    cursor: "pointer",
  };

  const saveBtn = {
    marginTop: 10,
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    border: "none",
    color: "white",
    padding: "12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
  };

  /* =========================
     LOADING
  ========================= */

  if (loading || !finalUser) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Cargando perfil...
      </div>
    );
  }

  /* =========================
     RENDER (MISMA ESTÉTICA)
  ========================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 20,
        backgroundImage: finalUser.fondoPerfil
          ? `url(${finalUser.fondoPerfil})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <img
            src={finalUser.fotoPerfil || "https://via.placeholder.com/150"}
            style={avatar}
          />

          <div style={{ flex: 1 }}>
            <h1>{finalUser.usuario}</h1>
            <p style={{ color: "#aaa" }}>{finalUser.descripcion}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setEditing(!editing)} style={btn}>
              Editar
            </button>
            <button onClick={handleLogout} style={btn}>
              Cerrar sesion
            </button>
          </div>
        </div>

        {/* EDITOR */}
        {editing && (
          <div style={card}>
            <label style={labelStyle}>Avatar</label>
            <input
              style={editInput}
              value={editData.fotoPerfil}
              onChange={(e) =>
                updateField("fotoPerfil", e.target.value)
              }
            />

            <label style={labelStyle}>Fondo</label>
            <input
              style={editInput}
              value={editData.fondoPerfil}
              onChange={(e) =>
                updateField("fondoPerfil", e.target.value)
              }
            />

            <label style={labelStyle}>Bio</label>
            <textarea
              style={textarea}
              value={editData.descripcion}
              onChange={(e) =>
                updateField("descripcion", e.target.value)
              }
            />

            <label style={labelStyle}>Canciones</label>

            {editData.canciones.map((song, i) => (
              <div key={i} style={songRow}>
                <span>♪</span>

                <input
                  style={songInput}
                  value={song}
                  onChange={(e) => {
                    const copy = [...editData.canciones];
                    copy[i] = e.target.value;
                    updateField("canciones", copy);
                  }}
                />

                <button
                  style={deleteBtn}
                  onClick={() => {
                    const copy = editData.canciones.filter(
                      (_, idx) => idx !== i
                    );
                    updateField("canciones", copy);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              style={addBtn}
              onClick={() =>
                updateField("canciones", [
                  ...editData.canciones,
                  "",
                ])
              }
            >
              + Agregar canción
            </button>

            <button style={saveBtn} onClick={saveProfile}>
              Guardar cambios
            </button>
          </div>
        )}

        {/* INFO */}
        <div style={split}>
          <div style={card}>
            <h3>Descripción</h3>
            <p>{finalUser.descripcion || "Sin descripción"}</p>
          </div>

          <div style={card}>
            <h3>Canciones</h3>

            {finalUser.canciones?.map((s: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <img src={songIcon} style={{ width: 16 }} />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* POSTS */}
        <div style={card}>
          <h3>Posts</h3>

          <div style={grid}>
            {posts.map((p) => (
              <div
                key={p._id}
                style={post}
                onClick={() => navigate(`/post/${p._id}`)}
              >
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    style={{
                      width: "100%",
                      height: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div
                  style={{
                    padding: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    height: p.images?.[0] ? "50%" : "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {p.descripcion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}