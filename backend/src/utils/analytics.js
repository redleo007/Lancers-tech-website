// Lightweight, deterministic analytics. No ML — just useful heuristics.

export function computeAnalytics(project, sessions) {
  const allStories = sessions.flatMap((s) => s.stories || []);
  const totalPoints = allStories.reduce(
    (sum, s) => sum + (s.finalPoints || s.complexity || 0),
    0
  );
  const avgComplexity =
    allStories.length === 0
      ? 0
      : allStories.reduce((s, x) => s + (x.complexity || 0), 0) / allStories.length;

  const riskCounts = { low: 0, medium: 0, high: 0 };
  allStories.forEach((s) => {
    riskCounts[s.risk || "low"]++;
  });
  const riskLevel =
    riskCounts.high > 2 ? "High" : riskCounts.medium > 3 ? "Medium" : "Low";

  const teamSize = Math.max(project.members.length, 1);
  // Assume 8 points / dev / sprint as a baseline velocity
  const sprints = Math.max(1, Math.ceil(totalPoints / (teamSize * 8)));
  const recommendedDays = sprints * (project.sprintLengthDays || 14);

  const workload = project.members.map((m) => ({
    name: m.name,
    role: m.role,
    estimatedPoints: Math.round(totalPoints / teamSize),
  }));

  const bestTeam = pickBestTeam(project.members, totalPoints);

  return {
    complexityScore: Math.round((avgComplexity + totalPoints / 10) * 10) / 10,
    totalPoints,
    riskLevel,
    riskBreakdown: riskCounts,
    recommendedSprints: sprints,
    recommendedDays,
    workload,
    bestTeam,
  };
}

function pickBestTeam(members, totalPoints) {
  if (!members.length) return [];
  const ideal = Math.min(members.length, Math.max(3, Math.ceil(totalPoints / 20)));
  const leaders = members.filter((m) => m.role === "TeamLeader");
  const others = members.filter((m) => m.role !== "TeamLeader");
  return [...leaders, ...others].slice(0, ideal).map((m) => m.name);
}
