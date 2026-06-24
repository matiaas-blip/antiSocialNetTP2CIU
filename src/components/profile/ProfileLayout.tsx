import { useEffect, useState } from "react";
import { getUserById, getAllUsers } from "../../api/users.api";
import { getPostsByUser } from "../../api/posts.api";

export default function ProfileLayout() {
  const userId = 1; // después viene de params (react-router)

  const [user, setUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [userData, usersData, postsData] = await Promise.all([
        getUserById(userId),
        getAllUsers(),
        getPostsByUser(userId),
      ]);

      console.log("USER DATA:", userData);
      console.log("ALL USERS:", usersData);
      console.log("POSTS DATA:", postsData);

      setUser(userData);
      setAllUsers(usersData);
      setPosts(postsData);
    } catch (error) {
      console.error("ERROR CARGANDO PERFIL:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [userId]);

  /* ---------------- MUTUAL FRIENDS ---------------- */

  const getFriends = () => {
    if (!user) return [];

    const following = new Set(user.seguidosIds || []);
    const followers = new Set(user.seguidoresIds || []);

    return allUsers.filter(
      (u) =>
        u.id !== user.id &&
        following.has(u.id) &&
        followers.has(u.id)
    );
  };

  if (loading) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Loading profile...
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
          maxWidth: 700,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        {/* ---------------- HEADER ---------------- */}

        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={user.fotoPerfil}
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
            }}
          />

          <div>
            <div style={{ fontSize: 12, color: "#888" }}>USER</div>
            <h1>{user.usuario}</h1>
          </div>
        </div>

        {/* ---------------- DESCRIPTION ---------------- */}

        <div style={card}>{user.descripcion}</div>

        {/* ---------------- FRIENDS ---------------- */}

        <div style={{ color: "#888" }}>Amistades</div>

        <div style={{ display: "flex", gap: 10 }}>
          {friends.map((f) => (
            <div key={f.id} style={friendCard}>
              <img
                src={f.fotoPerfil}
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

        {/* ---------------- POSTS ---------------- */}

        <div style={{ color: "#888" }}>Posts</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => (
            <div key={p.id} style={postCard}>
              <div style={{ fontWeight: "bold" }}>{p.title}</div>
              <div style={{ color: "#aaa", fontSize: 13 }}>
                {p.description}
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
  background: "#222",
  padding: 12,
  borderRadius: 14,
};

const friendCard = {
  background: "#1b1b1b",
  padding: 10,
  borderRadius: 14,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
};

const postCard = {
  background: "#1f1f1f",
  padding: 12,
  borderRadius: 14,
};