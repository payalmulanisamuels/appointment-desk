import StatusBadge from "@/components/StatusBadge";
import {
  formatDisplayDate,
  formatDisplayTime,
  getStatusActions,
} from "@/utils/appointmentHelpers";

// Column widths for the desktop "table" layout. AppointmentList uses the SAME
// value for its header row, so the headings always line up with the data.
// minmax(0, Nfr) = "share the space in these proportions, and allow shrinking".
// Columns: Patient | Service | Date | Time | Source | Status | Actions
export const ROW_COLUMNS =
  "md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,2fr)]";

// One appointment.
// Phone (below 768px): a card with small labels, two values per line.
// Tablet/desktop (768px and up): one row of a table, no labels (the header row has them).
// onStatusChange comes from page.js: calling it is how a button changes the real data.
export default function AppointmentCard({ appointment, onStatusChange }) {
  const actions = getStatusActions(appointment.status);

  return (
    <li
      className={`grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 md:items-center md:gap-3 md:py-3 ${ROW_COLUMNS}`}
    >
      {/* Patient: name, SAMPLE tag, phone and notes. Full width on phones. */}
      <div className="col-span-2 min-w-0 md:col-span-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium break-words text-slate-900">
            {appointment.patientName}
          </span>
          {appointment.isSample && (
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600">
              SAMPLE
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">{appointment.phone}</p>
        {/* Notes: on phones the full note wraps onto as many lines as needed (phones
            have no mouse hover). From 768px up it is limited to 2 lines to keep table
            rows tidy, and the full note shows when you hover over it (title). */}
        {appointment.notes && (
          <p
            className="mt-0.5 text-xs break-words text-slate-500 md:line-clamp-2"
            title={appointment.notes}
          >
            {appointment.notes}
          </p>
        )}
      </div>

      <Cell label="Service">{appointment.service}</Cell>
      <Cell label="Date">{formatDisplayDate(appointment.date)}</Cell>
      <Cell label="Time">{formatDisplayTime(appointment.time)}</Cell>
      <Cell label="Source">{appointment.source}</Cell>
      <Cell label="Status">
        <StatusBadge status={appointment.status} />
      </Cell>

      {/* Actions: full width on phones, last column on tablet/desktop */}
      <div className="col-span-2 md:col-span-1">
        {actions.length === 0 ? (
          <span className="text-sm text-slate-400" title="This status is final">
            —
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onStatusChange(appointment.id, action.newStatus)}
                aria-label={`${action.label}: ${appointment.patientName}`}
                className={
                  action.isMain
                    ? "min-h-10 rounded-md bg-teal-600 px-3 text-xs font-semibold text-white hover:bg-teal-700 md:min-h-0 md:py-1"
                    : "min-h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 md:min-h-0 md:py-1"
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

// One value with a small label above it. The label shows only on phones
// ("md:hidden" hides it from 768px up, where the header row shows the labels).
function Cell({ label, children }) {
  return (
    <div className="min-w-0">
      <span className="block text-xs text-slate-500 md:hidden">{label}</span>
      <span className="text-sm text-slate-700">{children}</span>
    </div>
  );
}
