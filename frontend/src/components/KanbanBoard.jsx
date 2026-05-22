const COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

export default function KanbanBoard({ cards = [], onMove }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {COLUMNS.map((col) => (
        <div key={col.key} className="glass rounded-2xl p-3 min-h-[300px]">
          <div className="flex justify-between mb-3">
            <div className="font-semibold">{col.label}</div>
            <div className="text-xs text-white/50">
              {cards.filter((c) => c.status === col.key).length}
            </div>
          </div>
          <div className="space-y-2">
            {cards
              .filter((c) => c.status === col.key)
              .map((c, i) => (
                <div key={i} className="glass-strong rounded-xl p-3">
                  <div className="text-sm font-semibold">{c.title}</div>
                  {c.assignee && (
                    <div className="text-xs text-white/50 mt-1">@{c.assignee}</div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {COLUMNS.filter((x) => x.key !== c.status).map((x) => (
                      <button
                        key={x.key}
                        onClick={() => onMove?.(i, x.key)}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
                      >
                        → {x.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
