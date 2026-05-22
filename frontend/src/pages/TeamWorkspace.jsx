import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function TeamWorkspace() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = () => {
    api.get("/users").then((r) => setUsers(r.data.users));
    api.get("/projects").then((r) => setProjects(r.data.projects));
  };
  useEffect(load, []);

  const createProject = async (e) => {
    e.preventDefault();
    await api.post("/projects", form);
    setForm({ name: "", description: "" });
    load();
  };

  const canCreate = ["Admin", "TeamLeader"].includes(user.role);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Team workspace</h1>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Members</div>
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u._id} className="flex items-center gap-3 glass-strong rounded-xl p-3">
                <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold"
                  style={{ background: u.avatarColor || "#7c5cff" }}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-white/50">{u.email}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-white/10">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          {canCreate && (
            <form onSubmit={createProject} className="glass rounded-2xl p-5 space-y-3">
              <div className="font-semibold">Create project</div>
              <input className="input" placeholder="Project name" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="input" placeholder="Description" rows={3}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <button className="btn btn-primary">Create</button>
            </form>
          )}

          <div className="glass rounded-2xl p-5">
            <div className="font-semibold mb-3">Projects</div>
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p._id} className="glass-strong rounded-xl p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-white/50">{p.description}</div>
                </li>
              ))}
              {projects.length === 0 && <div className="text-white/50 text-sm">No projects yet.</div>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
