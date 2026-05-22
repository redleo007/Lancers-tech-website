import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client.js";

export default function TimelineAnalytics() {
  const { projectId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!projectId) return;
    api.get(`/analytics/${projectId}`)
      .then((r) => setData(r.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed"));
  }, [projectId]);

  if (!projectId)
    return (
      <div className="glass rounded-2xl p-8 text-center text-white/60">
        Pick a project from Dashboard to view its analytics.
      </div>
    );

  if (err) return <div className="text-rose-300">{err}</div>;
  if (!data) return <div className="text-white/60">Crunching numbers…</div>;

  const riskColor =
    data.riskLevel === "High" ? "from-rose-500 to-orange-400"
      : data.riskLevel === "Medium" ? "from-amber-400 to-pink-500"
      : "from-emerald-400 to-cyan-400";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Timeline analytics</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Stat label="Complexity score" value={data.complexityScore} accent="from-brand-500 to-cyan-400" />
        <Stat label="Total points" value={data.totalPoints} accent="from-emerald-400 to-cyan-400" />
        <Stat label="Risk level" value={data.riskLevel} accent={riskColor} />
        <Stat label="Recommended sprint" value={`${data.recommendedDays}d`} accent="from-amber-400 to-pink-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Team workload</div>
          <ul className="space-y-2">
            {data.workload.map((w) => (
              <li key={w.name} className="glass-strong rounded-xl p-3 flex justify-between">
                <div>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-white/50">{w.role}</div>
                </div>
                <div className="font-bold">{w.estimatedPoints} pts</div>
              </li>
            ))}
            {data.workload.length === 0 && <div className="text-white/50 text-sm">No members yet.</div>}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-semibold mb-3">Recommended team</div>
          <div className="flex flex-wrap gap-2">
            {data.bestTeam.map((n) => (
              <span key={n} className="px-3 py-1 rounded-full bg-white/10 text-sm">{n}</span>
            ))}
            {data.bestTeam.length === 0 && <div className="text-white/50 text-sm">Add members first.</div>}
          </div>

          <div className="font-semibold mt-6 mb-2">Risk breakdown</div>
          <div className="space-y-1 text-sm">
            <Bar label="High" value={data.riskBreakdown.high} color="bg-rose-500" />
            <Bar label="Medium" value={data.riskBreakdown.medium} color="bg-amber-400" />
            <Bar label="Low" value={data.riskBreakdown.low} color="bg-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-white/60 text-sm">{label}</div>
      <div className={`text-3xl font-bold mt-2 bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}

function Bar({ label, value, color }) {
  const w = Math.min(100, value * 15);
  return (
    <div>
      <div className="flex justify-between text-xs text-white/60">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-2 bg-white/10 rounded">
        <div className={`h-2 rounded ${color}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}
