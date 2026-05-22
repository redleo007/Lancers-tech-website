import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
          Sprinzen
        </div>
        <nav className="flex gap-3">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-primary">Get started</Link>
        </nav>
      </header>

      <section className="max-w-5xl mx-auto text-center px-6 py-24">
        <div className="inline-block glass px-3 py-1 rounded-full text-xs text-white/70 mb-6">
          ✦ Agile estimation, reimagined
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Estimate sprints. <br />
          <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
            Together. In real time.
          </span>
        </h1>
        <p className="text-white/70 mt-6 max-w-2xl mx-auto">
          Sprinzen brings Planning Poker, live Kanban, shared notes & timeline
          analytics into one premium workspace — inspired by Jira, Linear and ClickUp.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/signup" className="btn btn-primary">Start estimating →</Link>
          <Link to="/login" className="btn btn-ghost">I already have an account</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-5 pb-24">
        {[
          { t: "Planning Poker", d: "Fibonacci voting with hidden ballots & dramatic reveals." },
          { t: "Live Kanban", d: "Real-time board updates powered by Socket.io." },
          { t: "Timeline Analytics", d: "Complexity, risk & recommended sprint length." },
        ].map((f) => (
          <div key={f.t} className="glass rounded-2xl p-6">
            <div className="text-xl font-semibold">{f.t}</div>
            <p className="text-white/60 mt-2 text-sm">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
