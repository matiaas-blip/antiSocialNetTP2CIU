import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/layout/Sidebar";
import useAuth from "../hooks/useAuth";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  // 📌 POST
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // 📌 COMMENTS
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/post/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchComments();
  }, [id]);

  // 📌 ADD COMMENT
  const handleComment = async () => {
    if (!commentText.trim()) return;

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
      console.error(err);
    }
  };

  // 📌 DELETE COMMENT
  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !post) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 sm:p-10 text-white">

      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">

        {/* IMAGE */}
        {post.images?.[0] && (
          <img
            src={post.images[0]}
            className="w-full max-h-[420px] object-cover"
          />
        )}

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-3">

          <h2 className="text-xl font-semibold">
            {post.descripcion}
          </h2>

          <p className="text-white/60 text-sm">
            Publicado por: {post.usuario?.usuario}
          </p>

          {/* COMMENTS */}
          <div className="mt-4 border-t border-white/10 pt-3">

            <h3 className="text-sm font-bold mb-3">
              Comentarios
            </h3>

            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">

              {comments.map((c: any) => {
                const isMine = c.usuario?._id === user?._id;

                return (
                  <div
                    key={c._id}
                    className="flex justify-between items-start text-sm border-b border-white/10 pb-2"
                  >

                    {/* TEXTO */}
                    <div>
                      <strong>
                        {c.usuario?.usuario || "anon"}
                      </strong>{" "}
                      <span>{c.texto}</span>
                    </div>

                    {/* ACCIONES */}
                    {isMine && (
                      <div className="flex items-center gap-2 ml-3">

                        {/* 3 PUNTOS VISUAL */}
                        <span className="text-white/40 select-none">
                          ⋯
                        </span>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDeleteComment(c._id)
                          }
                          className="text-red-500 text-xs hover:text-red-400"
                        >
                          Eliminar
                        </button>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>

            {/* INPUT */}
            <div className="flex gap-2 mt-4">

              <input
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                placeholder="Escribe un comentario..."
                className="flex-1 px-3 py-2 rounded-full bg-black/40 border border-white/10 outline-none"
              />

              <button
                onClick={handleComment}
                className="px-3 py-2 bg-blue-500 rounded-full text-sm"
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