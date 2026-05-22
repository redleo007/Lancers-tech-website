import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "TeamMember" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await signup(form);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="glass-strong rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Create your workspace</h1>
        <p className="text-white/60 text-sm mb-6">Spin up Sprinzen for your team.</p>
        {err && <div className="text-red-300 text-sm mb-3">{err}</div>}
        <label className="text-sm">Full name</label>
        <input className="input mt-1 mb-4" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label className="text-sm">Email</label>
        <input className="input mt-1 mb-4" type="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="text-sm">Password</label>
        <input className="input mt-1 mb-4" type="password" required minLength={6}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="text-sm">Role</label>
        <select className="input mt-1 mb-6"
          value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>TeamMember</option>
          <option>TeamLeader</option>
          <option>Admin</option>
        </select>
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? "Creating…" : "Create account"}
        </button>
        <div className="text-sm text-white/60 mt-4 text-center">
          Have an account? <Link to="/login" className="text-brand-500">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
