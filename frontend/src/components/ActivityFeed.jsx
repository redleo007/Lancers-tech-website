export default function ActivityFeed({ items = [] }) {
  return (
    <div className="glass rounded-2xl p-4 max-h-72 overflow-auto scrollbar">
      <div className="font-semibold mb-2">Activity</div>
      <ul className="space-y-2 text-sm">
        {items.length === 0 && (
          <li className="text-white/50">No activity yet.</li>
        )}
        {items.map((a, i) => (
          <li key={i} className="flex justify-between gap-2">
            <span className="text-white/80">{a.message}</span>
            <span className="text-white/40 text-xs">
              {new Date(a.at).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
