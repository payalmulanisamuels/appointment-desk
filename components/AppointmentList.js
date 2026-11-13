import AppointmentCard, { ROW_COLUMNS } from "@/components/AppointmentCard";

// The "Appointments" panel: a heading, the search + tabs (passed in as children),
// the column header row (tablet/desktop only) and one AppointmentCard per appointment.
// It receives appointments that are ALREADY filtered and sorted (page.js does that).
// totalCount = how many appointments exist in total, before filtering.
export default function AppointmentList({
  appointments,
  totalCount,
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

      {/* Simple messages for now; feature 8 replaces them with proper empty states */}
      {isLoaded && appointments.length === 0 && (
        <p className="px-4 py-6 text-sm text-slate-500">
          {totalCount === 0 ? "No appointments yet." : "No appointments match this filter."}
        </p>
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
