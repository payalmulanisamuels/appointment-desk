// Tailwind colours for each status: background, text and a thin outline
const STATUS_STYLES = {
  Booked: "bg-blue-50 text-blue-700 ring-blue-200",
  Confirmed: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Completed: "bg-green-50 text-green-700 ring-green-200",
  Cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  "No-show": "bg-amber-50 text-amber-800 ring-amber-200",
};

// A small coloured pill showing an appointment's status, e.g. "Confirmed"
export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
