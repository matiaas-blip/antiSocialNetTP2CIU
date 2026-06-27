import { useEffect, useState } from "react";
import { getUserById, getAllUsers } from "../api/users.api";
import { getPostsByUser } from "../api/posts.api";
import { profileStorage } from "../utils/profileStorage";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import defaultAvatar from "../assets/images/defaultAvatar.jpg";
import { useTheme } from "../context/ThemeContext";

export default function ProfileLayout() {
  const { user: authUser, logout, updateUser } = useAuth();
  const { theme,setThemeFromUser } = useTheme();
  const themeColor = theme?.primary || "#8b5cf6";
  const navigate = useNavigate();
  const location = useLocation();

  const userId = authUser?._id;

  const [finalUser, setFinalUser] = useState<any>(null);
  const [, setAllUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [editData, setEditData] = useState({
    descripcion: "",
    fotoPerfil: "",
    fondoPerfil: "",
    canciones: [] as string[],
    theme: {
      primary: "#8b5cf6",
    }
  });

  const updateField = (field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          navigate("/login");
          return;
        }

        const [userData, usersData, postsData] = await Promise.all([
          getUserById(userId),
          getAllUsers(),
          getPostsByUser(userId),
        ]);

        const merged = profileStorage.merge(userId, userData);

        setFinalUser(merged);
        setAllUsers(usersData);
        setPosts(postsData);

        setEditData({
          descripcion: merged.descripcion,
          fotoPerfil: merged.fotoPerfil,
          fondoPerfil: merged.fondoPerfil,
          canciones: merged.canciones,
          theme: merged.theme || { primary: "#8b5cf6" },
        });
      } catch (err) {
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, location.key]);


  const saveProfile = async () => {
    const updated = {
      ...finalUser,
      ...editData,
    };

    setFinalUser(updated);
    setEditing(false);

    profileStorage.set(userId, updated);
    updateUser(updated);

    setThemeFromUser(updated.theme || { primary: "#8b5cf6" });

    await api.put(`/users/${userId}/profile`, editData);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  if (loading || !finalUser) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Cargando perfil...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-start p-5 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: finalUser?.fondoPerfil?.trim()
          ? `url(${finalUser.fondoPerfil})`
          : undefined,
        backgroundColor: "#111",
      }}
    >
      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-[1100px] bg-[rgba(15,15,15,0.92)] rounded-[24px] p-[30px] flex flex-col gap-[15px]">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-[20px] bg-[#1f1f1f] p-[20px] rounded-[16px]">

          {/* AVATAR */}
          <img
            src={
              finalUser?.fotoPerfil?.trim()
                ? finalUser.fotoPerfil
                : defaultAvatar
            }
            className="w-[120px] h-[120px] rounded-[18px] object-cover"
          />

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{finalUser.usuario}</h1>
            <p className="text-[#aaa] mt-1">
              {finalUser.descripcion || "Sin descripción"}
            </p>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col gap-[10px] w-full md:w-auto">
            <button
              onClick={() => setEditing(!editing)}
              className="px-3 py-2 rounded-[10px]"
              style={{ background: themeColor }}
            >
              Editar
            </button>

            <button
              onClick={handleLogout}
              className="bg-[#555] hover:bg-[#666] transition px-3 py-2 rounded-[10px]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* EDIT SECTION */}
        {editing && (
          <div className="bg-[#1f1f1f] p-[15px] rounded-[14px] flex flex-col gap-3">

            <label className="text-xs text-[#888]">Avatar</label>
            <input
              className="w-full p-2 rounded-[10px] bg-[#151515] border border-white/10"
              value={editData.fotoPerfil}
              onChange={(e) => updateField("fotoPerfil", e.target.value)}
            />

            <label className="text-xs text-[#888]">Fondo</label>
            <input
              className="w-full p-2 rounded-[10px] bg-[#151515] border border-white/10"
              value={editData.fondoPerfil}
              onChange={(e) => updateField("fondoPerfil", e.target.value)}
            />

            <label className="text-xs text-[#888]">Bio</label>
            <textarea
              className="w-full min-h-[90px] p-2 rounded-[10px] bg-[#151515] border border-white/10"
              value={editData.descripcion}
              onChange={(e) => updateField("descripcion", e.target.value)}
            />
            <label className="text-xs text-[#888]">Color principal</label>

            <input
              type="color"
              value={editData.theme?.primary || "#8b5cf6"}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  theme: {
                    ...editData.theme,
                    primary: e.target.value,
                  },
                })
              }
            />

            {/* CANCIONES */}
            <div className="flex flex-col gap-2">
              {editData.canciones.map((song, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#141414] p-2 rounded-[10px]"
                >
                  <span>♪</span>

                  <input
                    className="flex-1 bg-transparent outline-none"
                    value={song}
                    onChange={(e) => {
                      const copy = [...editData.canciones];
                      copy[i] = e.target.value;
                      updateField("canciones", copy);
                    }}
                  />

                  <button
                    className="text-[#999]"
                    onClick={() =>
                      updateField(
                        "canciones",
                        editData.canciones.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              className="bg-white/10 hover:bg-white/20 transition p-2 rounded-[12px]"
              onClick={() =>
                updateField("canciones", [...editData.canciones, ""])
              }
            >
              + Agregar canción
            </button>

            <button
              className="p-3 rounded-[12px] font-bold"
              style={{
                background: themeColor,
              }}
              onClick={saveProfile}
            >
              Guardar cambios
            </button>
          </div>
        )}

        {/* INFO BOXES */}
        <div className="flex flex-col md:flex-row gap-[15px]">

          <div className="flex-1 bg-[#1f1f1f] p-[15px] rounded-[14px] text-[#bdbdbd]">
            <h3 className="text-white mb-2">Descripción</h3>
            <p>{finalUser.descripcion || "Sin descripción"}</p>
          </div>

          <div className="flex-1 bg-[#1f1f1f] p-[15px] rounded-[14px] text-[#bdbdbd]">
            <h3 className="text-white mb-2">Canciones</h3>

            <div className="flex flex-col gap-2">
              {finalUser.canciones?.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span>♪</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="bg-[#1f1f1f] p-[15px] rounded-[14px]">
          <h3 className="text-white mb-3">Posts</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {posts.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/post/${p._id}`)}
                className="relative aspect-square rounded-[12px] overflow-hidden cursor-pointer group"
              >
                {/* IMAGE */}
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}

                {/* GRADIENT OVERLAY ABAJO */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-3"
                  style={{
                    background: `linear-gradient(
                      to top,
                      ${themeColor}dd,
                      ${themeColor}55,
                      transparent
                    )`,
                  }}
                >
                  <p className="text-white text-sm line-clamp-3">
                    {p.descripcion}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}