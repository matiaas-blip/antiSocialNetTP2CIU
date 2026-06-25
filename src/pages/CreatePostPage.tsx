import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { createPost } from "../api/posts.api";
import PageWrapper from "../components/PageWrapper";

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setError("La descripción no puede estar vacía");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createPost({
        usuario: user?._id, // 🔥 IMPORTANTE: usar el usuario real
        descripcion,
        images: image ? [image] : [],
      });

      setDescripcion("");
      setImage("");

      navigate("/"); // vuelve al feed
    } catch (err: any) {
      console.log(err);
      setError("Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={container}>
        <h2 style={title}>Crear publicación</h2>

        <form onSubmit={handleSubmit} style={form}>
          {/* DESCRIPCIÓN */}
          <label style={label}>¿Qué estás pensando?</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribí algo..."
            style={textarea}
          />

          {/* IMAGEN */}
          <label style={label}>Imagen (opcional)</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL de imagen"
            style={input}
          />

          {/* PREVIEW */}
          {image && (
            <img
              src={image}
              alt="preview"
              style={preview}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* ERROR */}
          {error && <p style={errorText}>{error}</p>}

          {/* BOTÓN */}
          <button type="submit" disabled={loading} style={button}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  display: "flex",
  flexDirection: "column",
  gap: 15,
};

const title = {
  margin: 0,
  fontSize: 22,
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const label = {
  fontSize: 12,
  color: "#aaa",
};

const textarea = {
  width: "100%",
  minHeight: 120,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#151515",
  color: "white",
  outline: "none",
  resize: "none",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#151515",
  color: "white",
  outline: "none",
};

const preview = {
  width: "100%",
  maxHeight: 300,
  objectFit: "cover" as const,
  borderRadius: 12,
  marginTop: 5,
};

const errorText = {
  color: "#ff6b6b",
  fontSize: 12,
};

const button = {
  marginTop: 10,
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};