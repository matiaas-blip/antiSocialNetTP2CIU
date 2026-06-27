import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getUserById } from "../../api/users.api";
import { useTheme } from "../../context/ThemeContext";

import home from "../../assets/icons/home.svg";
import userIcon from "../../assets/icons/user.svg";
import defaultAvatar from "../../assets/images/defaultAvatar.jpg";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const { theme } = useTheme();
    const primary = theme.primary;

    const [collapsed, setCollapsed] = useState(false);
    const [setBackendUser] = useState<any>(null);

    useEffect(() => {
        if (!user?._id) return;

        const loadUser = async () => {
            const backendUser = await getUserById(user._id);
            setBackendUser(backendUser);
        };

        loadUser();
    }, [user?._id]);

    const finalUser = user;


    const items = [
        { label: "Inicio", icon: home, path: "/" },
        { label: "Perfil", icon: userIcon, path: "/profile" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className="sticky top-0 h-screen bg-[#0f0f14] flex flex-col border-r border-white/5 shadow-[4px_0_25px_rgba(0,0,0,0.65)] transition-all duration-300 z-50"
            style={{ width: collapsed ? 72 : 260 }}
        >

            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-sm"
                        style={{
                            background: primary,
                            boxShadow: `0 0 12px ${primary}`,
                        }}
                    />

                    {!collapsed && (
                        <span className="font-semibold text-white/80">
                            Anti-Social NET
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-white/50 text-sm"
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* NAV */}
            <nav className="flex-1 p-3 flex flex-col gap-2">
                {items.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 p-3 rounded-full cursor-pointer transition border
                                ${collapsed ? "justify-center" : ""}
                                ${active ? "bg-white/5" : "hover:bg-white/5 border-transparent"}
                            `}
                            style={{
                                borderColor: active ? primary : "transparent",
                                boxShadow: active ? `0 0 10px ${primary}22` : "none",
                            }}
                        >
                            <img src={item.icon} className="w-5 h-5" />
                            {!collapsed && <span>{item.label}</span>}
                        </div>
                    );
                })}
            </nav>

            {/* CREATE BUTTON */}
            <div className="p-3">
                <button
                    onClick={() => navigate("/create-post")}
                    className="w-full transition rounded-full py-2 font-semibold text-white"
                    style={{ background: primary }}
                >
                    {collapsed ? "+" : "+ Publicar"}
                </button>
            </div>

            {/* FOOTER USER */}
            <div className="border-t border-white/10 p-3 flex items-center gap-3">
                <div className="relative w-9 h-9 flex items-center justify-center">
                    <div
                        className="absolute w-10 h-10 rounded-full animate-pulse opacity-60 blur-md"
                        style={{ background: primary }}
                    />

                    <img
                        src={
                            finalUser?.fotoPerfil?.trim()
                                ? finalUser.fotoPerfil
                                : defaultAvatar
                        }
                        className="relative w-9 h-9 rounded-full object-cover border border-white/10 z-10"
                    />
                </div>

                {!collapsed && (
                    <div>
                        <p className="text-sm text-white">
                            {finalUser?.usuario || "Invitado"}
                        </p>

                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Activo
                        </p>
                    </div>
                )}
            </div>

        </aside>
    );
}