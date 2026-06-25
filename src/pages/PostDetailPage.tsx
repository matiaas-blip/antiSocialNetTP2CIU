import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import puntosIcon from "../assets/icons/puntos.svg";
import useAuth from "../hooks/useAuth";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [commentText, setCommentText] = useState("");

  // POST
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error cargando post:", err);
      }
    };

    fetchPost();
  }, [id]);

  // COMMENTS
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/post/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    };

    if (id) fetchComments();
  }, [id]);

  // DELETE POST
  const deletePost = async () => {
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Error eliminando post:", err);
    }
  };

  // CREATE COMMENT
  const handleComment = async () => {
    if (!commentText?.trim()) return;

    try {
      await api.post("/comments", {
        postId: id,
        texto: commentText.trim(),
        usuario: user?._id,
      });

      setCommentText("");

      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data);

    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };

  if (!post) return <div style={{ color: "white" }}>Cargando...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* MENU */}
        <div style={styles.menu}>
          <img
            src={puntosIcon}
            onClick={() => setOpenMenu(!openMenu)}
            style={styles.menuIcon}
          />

          {openMenu && (
            <div style={styles.dropdown}>
              <button onClick={deletePost} style={styles.deleteBtn}>
                🗑 Eliminar post
              </button>
            </div>
          )}
        </div>

        {/* IMAGE */}
        {post.images?.[0] && (
          <img src={post.images[0]} style={styles.image} />
        )}

        {/* CONTENT */}
        <div style={styles.content}>
          <h2 style={styles.title}>{post.descripcion}</h2>

          <p style={styles.author}>
            Publicado por: {post.usuario?.usuario}
          </p>

          {post.tags?.length > 0 && (
            <div style={styles.tags}>
              {post.tags.map((t: any, i: number) => (
                <span key={i} style={styles.tag}>
                  #{t.name || t}
                </span>
              ))}
            </div>
          )}

          {/* COMMENTS */}
          <div style={styles.commentsWrapper}>

            <div style={styles.commentsTitle}>
              Comentarios
            </div>

            <div style={styles.commentsList}>
              {(comments || []).map((c: any) => (
                <div key={c._id} style={styles.comment}>
                  <strong>
                    {c.usuario?.usuario || c.usuario || "anon"}
                  </strong>{" "}
                  <span>{c.texto}</span>
                </div>
              ))}
            </div>

            {/* FOOTER INPUT */}
            <div style={styles.commentInputBox}>

              {/* VOLVER */}
              <button
                onClick={() => navigate(-1)}
                style={styles.backBtn}
              >
                Volver
              </button>

              {/* INPUT */}
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe un comentario..."
                style={styles.input}
              />

              {/* COMENTAR */}
              <button
                onClick={handleComment}
                style={styles.btn}
              >
                Comentar
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    justifyContent: "center",
    padding: 20,
    color: "white",
  },

  card: {
    width: "100%",
    maxWidth: 750,
    background: "#1a1a1a",
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    border: "1px solid #2a2a2a",
  },

  menu: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  menuIcon: {
    width: 22,
    height: 22,
    cursor: "pointer",
    opacity: 0.8,
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 28,
    background: "#2a2a2a",
    borderRadius: 10,
    padding: 8,
    minWidth: 140,
  },

  deleteBtn: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#ff4d4d",
    padding: 8,
    cursor: "pointer",
    textAlign: "left",
  },

  image: {
    width: "100%",
    maxHeight: 420,
    objectFit: "cover",
  },

  content: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: 22,
    marginBottom: 8,
  },

  author: {
    color: "#aaa",
    marginBottom: 10,
  },

  tags: {
    display: "flex",
    gap: 6,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  tag: {
    fontSize: 12,
    padding: "3px 8px",
    borderRadius: 10,
    background: "#2a2a2a",
    color: "#ccc",
  },

  /* COMMENTS FULL HEIGHT */
  commentsWrapper: {
    marginTop: 15,
    borderTop: "1px solid #2a2a2a",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 300,
  },

  commentsTitle: {
    fontWeight: "bold",
    fontSize: 14,
    padding: "10px 0",
    borderBottom: "1px solid #2a2a2a",
  },

  commentsList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 0",
    display: "flex",
    flexDirection: "column",
    gap: 8,

    scrollbarWidth: "thin",
    scrollbarColor: "#444 transparent",
  },

  comment: {
    fontSize: 13,
    padding: 6,
    borderBottom: "1px solid #2a2a2a",
  },

  /* FOOTER BAR */
  commentInputBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTop: "1px solid #2a2a2a",
  },

  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 20,
    border: "1px solid #333",
    background: "#111",
    color: "white",
    outline: "none",
    minWidth: 0,
  },

  btn: {
    padding: "8px 12px",
    background: "#3897f0",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 20,
    whiteSpace: "nowrap",
  },

  backBtn: {
    padding: "8px 12px",
    background: "#444",
    border: "none",
    color: "white",
    borderRadius: 20,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};