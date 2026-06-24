import { useEffect, useState } from "react";
import { getUserById, getAllUsers } from "../../api/users.api";
import { getPostsByUser } from "../../api/posts.api";
import  useAuth  from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ProfileLayout() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const userId = authUser?._id;

  const [user, setUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        const [userData, usersData, postsData] = await Promise.all([
          getUserById(userId),
          getAllUsers(),
          getPostsByUser(userId),
        ]);

        if (!userData) {
          logout();
          navigate("/login");
          return;
        }

        setUser(userData);
        setAllUsers(usersData);
        setPosts(postsData);
      } catch (err) {
        console.error("ERROR CARGANDO PERFIL:", err);

        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /* ---------------- MUTUAL FRIENDS ---------------- */

  const getFriends = () => {
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

  if (loading) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Cargando perfil...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Usuario no encontrado
      </div>
    );
  }

  const friends = getFriends();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        paddingTop: 80,
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        {/* ---------------- HEADER ---------------- */}

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <img
            src={user.fotoPerfil || "https://via.placeholder.com/150"}
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
              objectFit: "cover",
            }}
          />

          <div>
            <div style={{ fontSize: 12, color: "#888" }}>USER</div>
            <h1 style={{ margin: 0 }}>{user.usuario}</h1>
          </div>
        </div>

        {/* ---------------- STATS ---------------- */}

        <div style={{ display: "flex", gap: 10 }}>
          <div style={card}>
            <div style={{ fontSize: 12, color: "#888" }}>Seguidores</div>
            <div>{user.seguidores?.length || 0}</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, color: "#888" }}>Seguidos</div>
            <div>{user.siguiendo?.length || 0}</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, color: "#888" }}>Amistades</div>
            <div>{friends.length}</div>
          </div>
        </div>

        {/* ---------------- FRIENDS ---------------- */}

        <div style={{ color: "#888" }}>Amistades mutuas</div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {friends.map((f) => (
            <div key={f._id} style={friendCard}>
              <img
                src={f.fotoPerfil || "https://via.placeholder.com/60"}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                }}
              />
              <div style={{ fontSize: 12 }}>{f.usuario}</div>
            </div>
          ))}
        </div>

        {/* ---------------- DESCRIPTION ---------------- */}

        <div style={card}>
          {user.descripcion || "Sin descripción"}
        </div>

        {/* ---------------- POSTS ---------------- */}

        <div style={{ color: "#888" }}>Posts</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => (
            <div key={p._id} style={postCard}>
              <div style={{ fontWeight: "bold" }}>
                {p.titulo || "Post"}
              </div>

              <div style={{ color: "#aaa", fontSize: 13 }}>
                {p.descripcion}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const card = {
  background: "#1f1f1f",
  padding: 12,
  borderRadius: 14,
  flex: 1,
};

const friendCard = {
  background: "#1b1b1b",
  padding: 10,
  borderRadius: 14,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  width: 80,
};

const postCard = {
  background: "#1f1f1f",
  padding: 12,
  borderRadius: 14,
};