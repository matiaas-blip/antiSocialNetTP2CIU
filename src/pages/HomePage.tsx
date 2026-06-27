import { useEffect, useState } from "react";
import { getPosts } from "../api/posts.api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HomePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      const data = await getPosts(1, 20);

      console.log(data);
      console.log(data[0]);

      setPosts(data);
    };

    fetch();
  }, []);

  const handleComment = async (postId: string) => {
    const texto = commentText[postId];
    if (!texto?.trim()) return;

    const newComment = {
      _id: Date.now(),
      texto: texto.trim(),
      usuario: {
        _id: user?._id,
        usuario: user?.usuario,
      },
    };

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
            ...p,
            comments: [...(p.comments || []), newComment],
          }
          : p
      )
    );

    setCommentText((prev) => ({ ...prev, [postId]: "" }));

    try {
      await api.post("/comments", {
        postId,
        texto: newComment.texto,
        usuario: user?._id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error eliminando post:", err);
    }
  };

return (
  <div className="flex flex-col gap-6 max-w-2xl mx-auto">

    {/* HEADER FEED */}
    <h2 className="text-white text-2xl font-bold tracking-tight">
      Feed
    </h2>

    <div className="flex flex-col gap-6">

      {posts.map((post) => {
        const isOwner = user?._id === post.usuario?._id;

        return (
          <div
            key={post._id}
            className="
              bg-[#151515]
              border border-white/10
              rounded-2xl
              overflow-hidden
              shadow-[0_10px_30px_rgba(0,0,0,0.4)]
              transition hover:scale-[1.01]
            "
          >

            {/* HEADER CLICK AREA */}
            <div
              onClick={() => navigate(`/post/${post._id}`)}
              className="cursor-pointer"
            >

              <div className="flex items-center justify-between px-4 py-3">

                {/* USER INFO */}
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    {post.usuario?.fotoPerfil ? (
                      <img
                        src={post.usuario.fotoPerfil}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-white/60">U</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <strong className="text-white text-sm">
                      {post.usuario?.usuario}
                    </strong>

                    <span className="text-white/40 text-xs">
                      hace un momento
                    </span>
                  </div>

                </div>

                {/* OPTIONS */}
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                    }}
                    className="
                      text-xs text-red-400
                      hover:text-red-300
                      px-2 py-1
                      rounded-md
                      hover:bg-red-500/10
                    "
                  >
                    eliminar
                  </button>
                )}

              </div>

              {/* IMAGE */}
              {post.images?.[0] && (
                <div className="relative">
                  <img
                    src={post.images[0]}
                    className="w-full max-h-[520px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="px-4 py-3">
                <p className="text-white/90 leading-relaxed">
                  {post.descripcion}
                </p>
              </div>

            </div>

            {/* COMMENTS SECTION */}
            <div className="px-4 pb-4 border-t border-white/10">

              <div className="mt-3 flex flex-col gap-2">

                {(post.comments || []).slice(0, 2).map((c: any) => (
                  <div
                    key={c._id}
                    className="text-sm text-white/70"
                  >
                    <span className="text-white font-medium">
                      {c.usuario?.usuario || "user"}
                    </span>{" "}
                    {c.texto}
                  </div>
                ))}

              </div>

              {/* INPUT */}
              <div
                className="flex gap-2 mt-3"
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
                  placeholder="Escribe un comentario..."
                  className="
                    flex-1 px-4 py-2
                    rounded-full
                    bg-black/40
                    border border-white/10
                    text-white text-sm
                    outline-none
                    focus:border-white/30
                  "
                />

                <button
                  onClick={() => handleComment(post._id)}
                  className="
                    px-4 py-2
                    bg-blue-500
                    hover:bg-blue-400
                    rounded-full
                    text-sm
                    font-medium
                    transition
                  "
                >
                  Enviar
                </button>

              </div>

            </div>

          </div>
        );
      })}

    </div>
  </div>
);
}