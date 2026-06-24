import { useEffect, useState } from "react";
import { getUserById, getAllUsers } from "../../api/users.api";
import { getPostsByUser } from "../../api/posts.api";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import songIcon from "../../assets/icons/song.svg";

export default function ProfileLayout() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const userId = authUser?._id;

  const [user, setUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [editData, setEditData] = useState({
    descripcion: "",
    fotoPerfil: "",
    canciones: [] as string[],
  });

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
        setPosts(postsData);

        setEditData({
          descripcion: userData.descripcion || "",
          fotoPerfil: userData.fotoPerfil || "",
          canciones: userData.canciones || [],
        });
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
    if (!user) return [];

    const following = new Set(user.siguiendo || []);
    const followers = new Set(user.seguidores || []);

    return allUsers.filter(
      (u) =>
        u._id !== user._id &&
        following.has(u._id) &&
        followers.has(u._id)
    );
  };

  /* ---------------- SAVE ---------------- */

  const saveProfile = async () => {
    setUser((prev: any) => ({
      ...prev,
      descripcion: editData.descripcion,
      fotoPerfil: editData.fotoPerfil,
      canciones: editData.canciones,
    }));

    setEditing(false);

    await api.put(`/users/${user._id}/profile`, {
      descripcion: editData.descripcion,
      fotoPerfil: editData.fotoPerfil,
      canciones: editData.canciones,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !user) {
    return <div style={{ color: "white", padding: 40 }}>Cargando perfil...</div>;
  }

  const mutuals = getMutuals();

  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <img
            src={user.fotoPerfil || "https://via.placeholder.com/150"}
            style={avatar}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#888" }}>USER</div>
            <h1 style={{ margin: 0 }}>{user.usuario}</h1>

            <div style={stats}>
              <div>Seguidores: {user.seguidores?.length || 0}</div>
              <div>Seguidos: {user.siguiendo?.length || 0}</div>
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

        {/* SPLIT */}
        <div style={split}>
          <div style={card}>
            <h3>Descripción</h3>
            <p>{user.descripcion || "Sin descripción"}</p>
          </div>

          {/* 🎵 CANCIONES EDITABLES */}
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
                <img
                  src={songIcon}
                  alt="song"
                  style={{ width: 16, height: 16 }}
                />

                <input
                  value={song}
                  onChange={(e) => {
                    const updated = [...editData.canciones];
                    updated[index] = e.target.value;

                    setEditData({
                      ...editData,
                      canciones: updated,
                    });
                  }}
                  style={input}
                />

                <button
                  onClick={() => {
                    const updated = editData.canciones.filter(
                      (_, i) => i !== index
                    );

                    setEditData({
                      ...editData,
                      canciones: updated,
                    });
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
            {posts.map((p) => (
              <div key={p._id} style={post}>
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