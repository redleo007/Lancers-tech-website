const FIB = [1, 2, 3, 5, 8, 13, 21];

export default function PokerDeck({ selected, onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-3">
      {FIB.map((v) => (
        <button
          key={v}
          disabled={disabled}
          onClick={() => onSelect(v)}
          className={`w-16 h-24 rounded-xl border text-2xl font-bold transition transform hover:-translate-y-1 ${
            selected === v
              ? "bg-gradient-to-br from-brand-500 to-cyan-400 border-transparent text-white shadow-glow"
              : "glass text-white/90 hover:border-brand-500"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
