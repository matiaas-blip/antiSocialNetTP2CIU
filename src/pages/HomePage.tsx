import { useEffect, useState } from "react";
import  api  from "../api/axios";
import { Link } from "react-router-dom";

type Post = {
  _id: string;
  descripcion: string;
  usuario: {
    _id: string;
    usuario: string;
  };
  tags: { _id: string; nombre: string }[];
  commentsCount?: number;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNumber: number) => {
    try {
      if (loadingMore) return;

      setLoadingMore(true);

      const res = await api.get(
        `/posts?page=${pageNumber}&limit=10`
      );

      const newPosts = res.data;

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setPage(pageNumber);
    } catch (err: any) {
      setError("Error al cargar posts");
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.body.offsetHeight;
      const windowHeight = window.innerHeight;

      const nearBottom =
        scrollY + windowHeight >= height - 200;

      if (nearBottom && !loadingMore && hasMore) {
        fetchPosts(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [page, loadingMore, hasMore]);

  if (loading) return <p>Cargando posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ paddingTop: "110px" }}>
      <h1> Feed de publicaciones</h1>

      {posts.length === 0 && <p>No hay posts aún</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              background: "#1e1e1e",
              color: "white",
            }}
          >
            {/* USUARIO */}
            <p style={{ fontSize: "14px", opacity: 0.7 }}>
              @{post.usuario?.usuario || "usuario"}
            </p>

            {/* DESCRIPCIÓN */}
            <h3>{post.descripcion}</h3>

            {/* TAGS */}
            <div style={{ display: "flex", gap: "8px" }}>
              {post.tags?.map((tag) => (
                <span
                  key={tag._id}
                  style={{
                    fontSize: "12px",
                    background: "#333",
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  #{tag.nombre}
                </span>
              ))}
            </div>

            {/* BOTÓN VER MÁS */}
            <Link to={`/post/${post._id}`}>
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Ver más
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}