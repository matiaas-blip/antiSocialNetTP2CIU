import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

import puntosIcon from "../assets/icons/puntos.svg";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    };

    fetchPost();
  }, [id]);

  const deletePost = async () => {
    await api.delete(`/posts/${id}`);
    navigate(-1);
  };

  if (!post) return <div style={{ color: "white" }}>Cargando...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          background: "#1c1c1c",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* MENU TOP RIGHT */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <img
            src={puntosIcon}
            onClick={() => setOpenMenu(!openMenu)}
            style={{
              width: 24,
              height: 24,
              cursor: "pointer",
              opacity: 0.8,
            }}
          />

          {openMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 30,
                background: "#2a2a2a",
                borderRadius: 10,
                padding: 8,
                minWidth: 140,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <button
                onClick={deletePost}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#ff4d4d",
                  padding: 8,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                🗑 Eliminar post
              </button>
            </div>
          )}
        </div>

        {/* IMAGE */}
        {post.images?.[0] && (
          <img
            src={post.images[0]}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
            }}
          />
        )}

        {/* CONTENT */}
        <div style={{ padding: 20 }}>
          <h2 style={{ fontSize: 24 }}>{post.descripcion}</h2>

          <p style={{ color: "#aaa" }}>
            Publicado por: {post.usuario?.usuario}
          </p>

          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: 15,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#444",
              color: "white",
              cursor: "pointer",
            }}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}