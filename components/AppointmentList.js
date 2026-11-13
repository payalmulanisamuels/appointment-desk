import AppointmentCard, { ROW_COLUMNS } from "@/components/AppointmentCard";

// The "Appointments" panel: a heading, the column header row (tablet/desktop only)
// and one AppointmentCard per appointment.
// It receives appointments that are ALREADY sorted (page.js does the sorting).
export default function AppointmentList({ appointments, isLoaded, onStatusChange }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">
          Appointments{" "}
          {isLoaded && (
            <span className="font-normal text-slate-500">({appointments.length})</span>
          )}
        </h2>
      </div>

      {/* Before localStorage is read we don't know the list yet */}
      {!isLoaded && <p className="px-4 py-6 text-sm text-slate-500">Loading appointments…</p>}

      {/* Simple message for now; feature 8 replaces it with proper empty states */}
      {isLoaded && appointments.length === 0 && (
        <p className="px-4 py-6 text-sm text-slate-500">No appointments yet.</p>
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
