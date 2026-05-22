import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/board", label: "Scrum Board", icon: "🃏" },
  { to: "/team", label: "Team", icon: "👥" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-4 glass m-3 rounded-2xl flex flex-col">
        <div className="text-2xl font-bold mb-6 bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
          Sprinzen
        </div>
        <nav className="space-y-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="glass-strong rounded-xl p-3 mt-4 text-sm">
          <div className="font-semibold truncate">{user?.name}</div>
          <div className="text-white/50 text-xs">{user?.role}</div>
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
            className="btn btn-ghost w-full mt-3 text-sm"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto scrollbar fade-in">
        <Outlet />
      </main>
    </div>
  );
}
