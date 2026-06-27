import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { createPost } from "../api/posts.api";
import { profileStorage } from "../utils/profileStorage";
import { getUserById } from "../api/users.api";

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullUser, setFullUser] = useState<any>(null);

  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Traer usuario completo (backend + localStorage)
  useEffect(() => {
    const loadUser = async () => {
      if (!user?._id) return;

      try {
        const backendUser = await getUserById(user._id);
        const merged = profileStorage.merge(user._id, backendUser);

        setFullUser(merged);
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    };

    loadUser();
  }, [user]);

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

      navigate("/");
    } catch (err) {
      setError("Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  if (!fullUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  const avatar =
    fullUser.fotoPerfil?.trim() ||
    "https://via.placeholder.com/40";

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-[#0f0f0f] text-white">

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#151515] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
      >

        {/* HEADER USER */}
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />

          <div>
            <p className="font-semibold">
              {fullUser.usuario}
            </p>
            <p className="text-xs text-gray-400">
              Crear nueva publicación
            </p>
          </div>
        </div>

        {/* TEXTO */}
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="¿Qué estás pensando?"
          className="
            w-full min-h-[140px] p-3 rounded-xl
            bg-black/40 border border-white/10
            outline-none resize-none
            focus:border-purple-500 transition
          "
        />

        {/* INPUT IMAGEN */}
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="URL de imagen (opcional)"
          className="
            w-full p-3 rounded-xl
            bg-black/40 border border-white/10
            outline-none focus:border-purple-500 transition
          "
        />

        {/* PREVIEW */}
        {image && (
          <img
            src={image}
            alt="preview"
            className="rounded-xl max-h-[300px] object-cover border border-white/10"
          />
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm">
            ⚠ {error}
          </p>
        )}

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading || !descripcion.trim()}
          className="
            w-full py-3 rounded-xl font-semibold
            bg-gradient-to-r from-purple-500 to-blue-500
            hover:opacity-90 active:scale-[0.98]
            transition disabled:opacity-40
          "
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}