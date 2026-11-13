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
            className={
              isActive
                ? "rounded-full bg-teal-600 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
            }
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
