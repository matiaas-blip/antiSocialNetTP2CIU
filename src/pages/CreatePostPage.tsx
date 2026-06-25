import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { createPost } from "../api/posts.api";
import { PageWrapper } from "../components/PageWrapper";

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
        usuario: user?._id,
        descripcion,
        images: image ? [image] : [],
      });

      setDescripcion("");
      setImage("");

      navigate("/");
    } catch (err) {
      setError("Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={styles.container}>
        <h2 style={styles.title}>Crear publicación</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* TEXTO */}
          <label style={styles.label}>¿Qué estás pensando?</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribí algo..."
            style={styles.textarea}
          />

          {/* IMAGEN */}
          <label style={styles.label}>Imagen (opcional)</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL de imagen"
            style={styles.input}
          />

          {/* PREVIEW */}
          {image && (
            <img
              src={image}
              alt="preview"
              style={styles.preview}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* ERROR */}
          {error && <p style={styles.error}>{error}</p>}

          {/* BUTTON */}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

/* ================= STYLES ================= */

const styles: any = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  title: {
    margin: 0,
    fontSize: 22,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  textarea: {
    width: "100%",
    minHeight: 140,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    background: "#151515",
    color: "white",
    resize: "none",
    outline: "none",
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    background: "#151515",
    color: "white",
    outline: "none",
  },

  preview: {
    width: "100%",
    maxHeight: 280,
    objectFit: "cover",
    borderRadius: 10,
  },

  error: {
    color: "#ff6b6b",
    fontSize: 12,
  },

  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    background: "#1f1f1f",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};