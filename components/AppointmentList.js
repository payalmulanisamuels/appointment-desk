import AppointmentCard, { ROW_COLUMNS } from "@/components/AppointmentCard";
import EmptyState from "@/components/EmptyState";

// Picks the empty-state title + message that explains WHY the list is empty.
// The checks run in order and the first one that matches wins.
function getEmptyStateText(totalCount, activeFilter, searchText) {
  // 1. Nothing saved at all
  if (totalCount === 0) {
    return {
      title: "No appointments yet",
      message: "Add the first appointment using the form, or click Load Sample Data at the top.",
    };
  }
  // 2. Something is typed in search, and nothing matches it in this tab
  if (searchText.trim() !== "") {
    const where = activeFilter === "All" ? "" : ` in ${activeFilter}`;
    return {
      title: "No matching appointments",
      message: `Nothing matches "${searchText.trim()}"${where}. Check the spelling, or clear the search.`,
    };
  }
  // 3–5. The selected tab is empty
  if (activeFilter === "Today") {
    return { title: "No appointments for today", message: "Today's schedule is clear." };
  }
  if (activeFilter === "Upcoming") {
    return {
      title: "No upcoming appointments",
      message: "Nothing is booked from tomorrow onward.",
    };
  }
  // A status tab. (A title like "No No-show appointments" reads badly,
  // so the title stays general and the status name goes in the message.)
  return {
    title: "No appointments with this status",
    message: `No appointment currently has the ${activeFilter} status.`,
  };
}

// The "Appointments" panel: a heading, the search + tabs (passed in as children),
// the column header row (tablet/desktop only) and one AppointmentCard per appointment.
// It receives appointments that are ALREADY filtered and sorted (page.js does that).
// totalCount = how many appointments exist in total, before filtering.
// activeFilter + searchText are only used to choose the right empty-state message.
export default function AppointmentList({
  appointments,
  totalCount,
  activeFilter,
  searchText,
  isLoaded,
  onStatusChange,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-3 border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">
          Appointments{" "}
          {isLoaded && (
            <span className="font-normal text-slate-500">
              {/* "(3 of 10)" while filtering, "(10)" when everything is shown */}
              {appointments.length === totalCount
                ? `(${totalCount})`
                : `(${appointments.length} of ${totalCount})`}
            </span>
          )}
        </h2>

        {/* "children" = whatever page.js puts between <AppointmentList> and
            </AppointmentList>: here the search box and the filter tabs */}
        {children}
      </div>

      {/* Before localStorage is read we don't know the list yet */}
      {!isLoaded && <p className="px-4 py-6 text-sm text-slate-500">Loading appointments…</p>}

      {/* Nothing to show: explain why (the ... spreads title and message in as props) */}
      {isLoaded && appointments.length === 0 && (
        <EmptyState {...getEmptyStateText(totalCount, activeFilter, searchText)} />
      )}

      {isLoaded && appointments.length > 0 && (
        <>
          {/* Column headings: hidden on phones, a grid row from 768px up */}
          <div
            className={`hidden gap-3 bg-slate-50 px-4 py-2 text-xs font-medium tracking-wide text-slate-500 uppercase md:grid ${ROW_COLUMNS}`}
          >
            <span>Patient</span>
            <span>Service</span>
            <span>Date</span>
            <span>Time</span>
            <span>Source</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* key: a unique id per item, so React can track each row when the list changes */}
          <ul className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={onStatusChange}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
