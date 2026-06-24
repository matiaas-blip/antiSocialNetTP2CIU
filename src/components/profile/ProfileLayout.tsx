import { useEffect, useState } from "react";
import { getUserById, getAllUsers } from "../../api/users.api";
import { getPostsByUser } from "../../api/posts.api";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import songIcon from "../../assets/icons/song.svg";

const PROFILE_STORAGE_KEY = "antisocial_profile_data";

export default function ProfileLayout() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const userId = authUser?._id;

  const [user, setUser] = useState<any>(null);
  const [finalUser, setFinalUser] = useState<any>(null);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [editData, setEditData] = useState({
    descripcion: "",
    fotoPerfil: "",
    canciones: [] as string[],
  });

  /* ---------------- LOCAL STORAGE ---------------- */

  const saveToLocal = (data: any) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  };

  /* ---------------- FETCH ---------------- */

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

        setUser(userData);
        setAllUsers(usersData);

        const local = loadFromLocal();

        const mergedUser = {
          ...userData,
          descripcion: local?.descripcion ?? userData.descripcion ?? "",
          fotoPerfil: local?.fotoPerfil ?? userData.fotoPerfil ?? "",
          canciones: local?.canciones ?? userData.canciones ?? [],
        };

        setFinalUser(mergedUser);

        setEditData({
          descripcion: mergedUser.descripcion,
          fotoPerfil: mergedUser.fotoPerfil,
          canciones: mergedUser.canciones,
        });

        setPosts(local?.posts ?? postsData ?? []);
      } catch (err) {
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /* ---------------- MUTUALS ---------------- */

  const getMutuals = () => {
    if (!finalUser) return [];

    const following = new Set(finalUser.siguiendo || []);
    const followers = new Set(finalUser.seguidores || []);

    return allUsers.filter(
      (u) =>
        u._id !== finalUser._id &&
        following.has(u._id) &&
        followers.has(u._id)
    );
  };

  /* ---------------- SAVE PROFILE ---------------- */

  const saveProfile = async () => {
    const updatedUser = {
      ...finalUser,
      descripcion: editData.descripcion,
      fotoPerfil: editData.fotoPerfil,
      canciones: editData.canciones,
    };

    setFinalUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);

    saveToLocal({
      descripcion: editData.descripcion,
      fotoPerfil: editData.fotoPerfil,
      canciones: editData.canciones,
      posts,
    });

    await api.put(`/users/${userId}/profile`, {
      descripcion: editData.descripcion,
      fotoPerfil: editData.fotoPerfil,
      canciones: editData.canciones,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !finalUser) {
    return <div style={{ color: "white", padding: 40 }}>Cargando perfil...</div>;
  }

  const mutuals = getMutuals();

  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <img
            src={finalUser.fotoPerfil || "https://via.placeholder.com/150"}
            style={avatar}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#888" }}>USER</div>
            <h1 style={{ margin: 0 }}>{finalUser.usuario}</h1>

            <div style={stats}>
              <div>Seguidores: {finalUser.seguidores?.length || 0}</div>
              <div>Seguidos: {finalUser.siguiendo?.length || 0}</div>
              <div>Mutuals: {mutuals.length}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setEditing(!editing)} style={btn}>
              Editar perfil
            </button>

            <button onClick={handleLogout} style={{ ...btn, background: "#3a1f1f" }}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* EDIT */}
        {editing && (
          <div style={card}>
            <h3>Editar perfil</h3>

            <input
              style={input}
              placeholder="Foto URL"
              value={editData.fotoPerfil}
              onChange={(e) =>
                setEditData({ ...editData, fotoPerfil: e.target.value })
              }
            />

            <textarea
              style={{ ...input, height: 80 }}
              placeholder="Descripción"
              value={editData.descripcion}
              onChange={(e) =>
                setEditData({ ...editData, descripcion: e.target.value })
              }
            />

            <button onClick={saveProfile} style={btn}>
              Guardar cambios
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div style={split}>
          <div style={card}>
            <h3>Descripción</h3>
            <p>{finalUser.descripcion || "Sin descripción"}</p>
          </div>

          <div style={card}>
            <h3>Canciones</h3>

            {editData.canciones.map((song: string, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 8,
                  alignItems: "center",
                }}
              >
                <img src={songIcon} style={{ width: 16, height: 16 }} />

                <input
                  value={song}
                  onChange={(e) => {
                    const updated = [...editData.canciones];
                    updated[index] = e.target.value;
                    setEditData({ ...editData, canciones: updated });
                  }}
                  style={input}
                />

                <button
                  onClick={() => {
                    const updated = editData.canciones.filter(
                      (_, i) => i !== index
                    );
                    setEditData({ ...editData, canciones: updated });
                  }}
                  style={btn}
                >
                  X
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setEditData({
                  ...editData,
                  canciones: [...editData.canciones, ""],
                })
              }
              style={btn}
            >
              + Agregar canción
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div style={card}>
          <h3>Posts</h3>

          <div style={grid}>
            {posts.map((p: any) => (
              <div key={p._id || p.descripcion} style={post}>
                {p.descripcion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  minHeight: "100vh",
  background: "#0f0f0f",
  paddingTop: 80,
  color: "white",
};

const container = {
  maxWidth: 1000,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 15,
};

const header = {
  display: "flex",
  gap: 20,
  alignItems: "center",
  background: "#1f1f1f",
  padding: 20,
  borderRadius: 16,
};

const avatar = {
  width: 120,
  height: 120,
  borderRadius: 18,
  objectFit: "cover",
};

const stats = {
  display: "flex",
  gap: 15,
  marginTop: 10,
  fontSize: 13,
  color: "#aaa",
};

const split = {
  display: "flex",
  gap: 15,
};

const card = {
  background: "#1f1f1f",
  padding: 15,
  borderRadius: 14,
  flex: 1,
};

const btn = {
  background: "#2a2a2a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 10,
  background: "#222",
  border: "none",
  color: "white",
  borderRadius: 10,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
};

const post = {
  aspectRatio: "1/1",
  background: "#222",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 10,
  textAlign: "center",
};