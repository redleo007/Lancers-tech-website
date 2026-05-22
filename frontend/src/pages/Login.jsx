import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(form.email, form.password);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="glass-strong rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-white/60 text-sm mb-6">Sign in to your Sprinzen workspace.</p>
        {err && <div className="text-red-300 text-sm mb-3">{err}</div>}
        <label className="text-sm">Email</label>
        <input className="input mt-1 mb-4" type="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="text-sm">Password</label>
        <input className="input mt-1 mb-6" type="password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="text-sm text-white/60 mt-4 text-center">
          New here? <Link to="/signup" className="text-brand-500">Create account</Link>
        </div>
      </form>
    </div>
  );
}
