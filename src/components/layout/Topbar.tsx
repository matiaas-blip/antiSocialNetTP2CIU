import { useTheme } from "../../context/ThemeContext";

export default function Topbar() {
  const { theme } = useTheme();
  const primary = theme.primary;

  return (
    <div className="sticky top-0 z-40 h-[60px] flex items-center justify-between px-4 border-b border-white/10 bg-[#0f0f14]/80 backdrop-blur-md">

      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-sm"
          style={{
            background: primary,
            boxShadow: `0 0 10px ${primary}`,
          }}
        />

        <span className="text-white/70 font-medium tracking-wide">
          AntiSocial Network
        </span>
      </div>

      <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer" />
    </div>
  );
}