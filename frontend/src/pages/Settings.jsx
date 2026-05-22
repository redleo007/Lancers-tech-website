import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="glass rounded-2xl p-6 space-y-3">
        <div className="font-semibold">Profile</div>
        <div className="text-sm">
          <div className="text-white/60">Name</div>
          <div>{user?.name}</div>
        </div>
        <div className="text-sm">
          <div className="text-white/60">Email</div>
          <div>{user?.email}</div>
        </div>
        <div className="text-sm">
          <div className="text-white/60">Role</div>
          <div>{user?.role}</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="font-semibold mb-2">Appearance</div>
        <p className="text-sm text-white/60">
          Sprinzen ships dark-mode-first with glassmorphism. Theme switching coming soon.
        </p>
      </div>
    </div>
  );
}
