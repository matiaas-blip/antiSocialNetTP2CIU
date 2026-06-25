import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../api/posts.api";

import { PageWrapper, GlassCard } from "../components/PageUI";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts(1, 20);
        setPosts(data);
      } catch (err) {
        console.log("Error cargando posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <PageWrapper>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>🔥 Feed</h2>

        <span style={{ color: "#888", fontSize: 13 }}>
          AntiSocial Network
        </span>
      </div>

      {/* POSTS */}
      {posts.map((p) => (
        <GlassCard
          key={p._id}
          onClick={() => navigate(`/post/${p._id}`)}
          style={{
            cursor: "pointer",
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* IMAGE */}
          {p.images?.[0] && (
            <img
              src={p.images[0]}
              alt="post"
              style={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          {/* CONTENT */}
          <div style={{ padding: 14 }}>
            {/* USER */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
                color: "white",
              }}
            >
              {p.usuario?.usuario || "Usuario"}
            </div>

            {/* DESCRIPTION */}
            <div
              style={{
                fontSize: 14,
                color: "#cfcfcf",
                lineHeight: "1.4",
              }}
            >
              {p.descripcion}
            </div>
          </div>
        </GlassCard>
      ))}
    </PageWrapper>
  );
}