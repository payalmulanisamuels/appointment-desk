import StatusBadge from "@/components/StatusBadge";
import { formatDisplayDate, formatDisplayTime } from "@/utils/appointmentHelpers";

// Column widths for the desktop "table" layout. AppointmentList uses the SAME
// value for its header row, so the headings always line up with the data.
// minmax(0, Nfr) = "share the space in these proportions, and allow shrinking".
export const ROW_COLUMNS =
  "md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]";

// One appointment.
// Phone (below 768px): a card with small labels, two values per line.
// Tablet/desktop (768px and up): one row of a table, no labels (the header row has them).
export default function AppointmentCard({ appointment }) {
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
        {appointment.notes && (
          <p className="mt-0.5 truncate text-xs text-slate-400" title={appointment.notes}>
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
