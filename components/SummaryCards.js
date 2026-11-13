// The 5 number cards at the top of the dashboard.
// counts comes from getSummaryCounts() in page.js and is ALWAYS about today.
// Before localStorage has loaded, counts is null and we show "–" instead of a fake 0.
export default function SummaryCards({ counts }) {
  const cards = [
    { label: "Today's total", value: counts?.total, accent: "border-l-teal-500" },
    { label: "Booked", value: counts?.booked, accent: "border-l-blue-500" },
    { label: "Confirmed", value: counts?.confirmed, accent: "border-l-indigo-500" },
    { label: "Completed", value: counts?.completed, accent: "border-l-green-500" },
    {
      label: "Cancelled / No-show",
      // whitespace-nowrap keeps "No-show" on one line (browsers may break at the hyphen)
      display: (
        <>
          Cancelled / <span className="whitespace-nowrap">No-show</span>
        </>
      ),
      value: counts?.cancelledOrNoShow,
      accent: "border-l-amber-500",
    },
  ];

  return (
    <section aria-label="Today's summary">
      {/* 2 per row on phones (the first card spans the full row), 3 on tablets, 5 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-sm ${card.accent} ${
              index === 0 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <p className="text-sm font-medium text-slate-600">{card.display ?? card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value ?? "–"}</p>
            <p className="text-xs text-slate-400">Today</p>
          </div>
        ))}
      </div>
    </section>
  );
}
