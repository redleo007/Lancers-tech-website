import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data.projects)).catch(() => {});
  }, []);

  const stats = [
    { label: "Active projects", value: projects.length, accent: "from-brand-500 to-cyan-400" },
    { label: "Avg sprint", value: "14d", accent: "from-amber-400 to-pink-500" },
    { label: "Team velocity", value: "32 pts", accent: "from-emerald-400 to-cyan-400" },
    { label: "Open risks", value: "3", accent: "from-rose-500 to-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-white/60">Here's what's happening across your sprints.</p>
        </div>
        <Link to="/board" className="btn btn-primary">New estimation session</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-white/60 text-sm">{s.label}</div>
            <div className={`text-3xl font-bold mt-2 bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Recent projects</div>
          {projects.length === 0 ? (
            <p className="text-white/50 text-sm">No projects yet. Create one from the Team page.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p._id} className="flex justify-between glass-strong rounded-xl p-3">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-white/50">{p.description}</div>
                  </div>
                  <Link to={`/analytics/${p._id}`} className="text-brand-500 text-sm">Analytics →</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Notifications</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="glass-strong rounded-xl p-3">🔔 No new notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
