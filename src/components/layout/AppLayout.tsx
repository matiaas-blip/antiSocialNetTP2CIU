import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-[#0f0f14] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}