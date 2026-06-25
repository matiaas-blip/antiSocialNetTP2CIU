import { useEffect, useState } from "react";
import { getPosts } from "../api/posts.api";
import { createComment } from "../api/comments.api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";
import api from "../api/axios";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      const data = await getPosts(1, 20);
      setPosts(data);
    };

    fetch();
  }, []);

  const handleComment = async (postId: string) => {
    const texto = commentText[postId];
    if (!texto?.trim()) return;

    const tempComment = {
      _id: Date.now(),
      texto: texto.trim(),
      usuario: {
        _id: user?._id,
        usuario: user?.usuario,
      },
    };

    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? {
            ...p,
            comments: [...(p.comments || []), tempComment],
          }
          : p
      )
    );

    setCommentText(prev => ({ ...prev, [postId]: "" }));

    await api.post(`/comments`, {
      postId,
      texto: tempComment.texto,
      usuario: tempComment.usuario,
    });
  };

  return (
    <PageWrapper>
      <h2>Feed</h2>

      <div style={styles.feed}>
        {posts.map((post) => (
          <div key={post._id} style={styles.card}>

            {/* CONTENIDO CLICKABLE */}
            <div
              onClick={() => navigate(`/post/${post._id}`)}
              style={{ cursor: "pointer" }}
            >
              <strong>{post.usuario?.usuario || "user"}</strong>

              {post.images?.length > 0 && (
                <img src={post.images[0]} style={styles.image} />
              )}

              <p>{post.descripcion}</p>
            </div>

            {/* COMMENTS */}
            <div>
              {(post.comments || []).map((c: any, i: number) => (
                <div key={i} style={styles.comment}>
                  <strong>{c.usuario?.usuario || c.usuario}:</strong> {c.texto}
                </div>
              ))}

              {/* INPUT (NO ABRE DETAIL) */}
              <div
                style={styles.commentBox}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post._id]: e.target.value,
                    })
                  }
                  placeholder="Comentario..."
                  style={styles.input}
                />

                <button onClick={() => handleComment(post._id)}>
                  Comentar
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

/* ================= STYLES ================= */

const styles: any = {
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: 12,
  },

  image: {
    width: "100%",
    borderRadius: 10,
    marginTop: 8,
  },

  comment: {
    fontSize: 13,
    borderBottom: "1px solid #222",
    padding: 4,
  },

  commentBox: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  input: {
    flex: 1,
    padding: 8,
    background: "#111",
    border: "1px solid #333",
    color: "white",
    borderRadius: 6,
  },
};