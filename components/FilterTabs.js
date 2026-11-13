import { FILTERS } from "@/utils/appointmentHelpers";

// The row of filter buttons: All · Today · Upcoming · Booked · ... · No-show.
// It doesn't remember which tab is selected itself: page.js owns that
// (activeFilter) and gives us a function to change it (onFilterChange).
export default function FilterTabs({ activeFilter, onFilterChange }) {
  return (
    // flex-wrap: on narrow screens the tabs move onto a second line (no sideways scroll)
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter appointments">
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive} // tells screen readers which tab is on
            // min-h-10: 40px tall on phones/tablets for easy tapping; compact from 768px up
            className={
              isActive
                ? "min-h-10 rounded-full bg-teal-600 px-3 py-1.5 text-sm font-medium text-white md:min-h-0"
                : "min-h-10 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 md:min-h-0"
            }
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
