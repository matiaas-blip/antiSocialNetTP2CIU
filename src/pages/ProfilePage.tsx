import { useEffect, useState } from "react";
import { getUserById, getAllUsers } from "../api/users.api";
import { getPostsByUser } from "../api/posts.api";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

import songIcon from "../assets/icons/song.svg";

const PROFILE_STORAGE_KEY = "antisocial_profile_data";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}


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


  const saveToLocal = (data: any) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  };


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

        const local = loadFromLocal();

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


  const saveProfile = async () => {
    const updated = {
      ...finalUser,
      ...editData,
    };

    setFinalUser(updated);
    setEditing(false);

    saveToLocal(updated);

    await api.put(`/users/${userId}/profile`, editData);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !finalUser) {
    return <div style={{ color: "white", padding: 40 }}>Cargando perfil...</div>;
  }

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

  const inputRow = {
    display: "flex",
    alignItems: "center",
    gap: 10,
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

        {editing && (
          <div
            style={{
              marginTop: 15,
              padding: 0,
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(145deg, #1a1a1a, #111)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* HEADER DEL PANEL */}
            <div
              style={{
                padding: 15,
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3 style={{ margin: 0, color: "white", letterSpacing: 1 }}>
                ✦ Editar identidad
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                Personalizá cómo te ven los demás
              </p>
            </div>

            {/* CONTENIDO */}
            <div
              style={{
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >

              {/* FOTO PERFIL */}
              <div>
                <label style={labelStyle}>Avatar</label>
                <div style={inputRow}>
                  <input
                    style={editInput}
                    placeholder="URL de imagen de perfil"
                    value={editData.fotoPerfil}
                    onChange={(e) =>
                      setEditData({ ...editData, fotoPerfil: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* FONDO */}
              <div>
                <label style={labelStyle}>Fondo / Header</label>
                <input
                  style={editInput}
                  placeholder="URL de imagen de fondo"
                  value={editData.fondoPerfil}
                  onChange={(e) =>
                    setEditData({ ...editData, fondoPerfil: e.target.value })
                  }
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                  style={textarea}
                  placeholder="Escribí algo que te represente..."
                  value={editData.descripcion}
                  onChange={(e) =>
                    setEditData({ ...editData, descripcion: e.target.value })
                  }
                />
              </div>

              {/* CANCIONES */}
              <div>
                <label style={labelStyle}>Canciones destacadas</label>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {editData.canciones.map((song, i) => (
                    <div key={i} style={songRow}>
                      <span style={{ color: "#666" }}>♪</span>

                      <input
                        style={songInput}
                        value={song}
                        placeholder="Nombre o link"
                        onChange={(e) => {
                          const copy = [...editData.canciones];
                          copy[i] = e.target.value;
                          setEditData({ ...editData, canciones: copy });
                        }}
                      />

                      <button
                        onClick={() => {
                          const copy = editData.canciones.filter((_, idx) => idx !== i);
                          setEditData({ ...editData, canciones: copy });
                        }}
                        style={deleteBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setEditData({
                      ...editData,
                      canciones: [...editData.canciones, ""],
                    })
                  }
                  style={addBtn}
                >
                  + Agregar canción
                </button>
              </div>

              {/* GUARDAR */}
              <button onClick={saveProfile} style={saveBtn}>
                Guardar cambios
              </button>
            </div>
          </div>
        )}


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
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
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
