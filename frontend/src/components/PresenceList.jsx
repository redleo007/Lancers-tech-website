export default function PresenceList({ users = [] }) {
  return (
    <div className="flex -space-x-2">
      {users.map((u, i) => (
        <div
          key={i}
          title={u.name}
          className="w-8 h-8 rounded-full border-2 border-ink grid place-items-center text-xs font-bold"
          style={{ background: u.avatarColor || "#7c5cff" }}
        >
          {u.name?.[0]?.toUpperCase()}
        </div>
      ))}
      {users.length === 0 && (
        <div className="text-xs text-white/50">No one here yet</div>
      )}
    </div>
  );
}
