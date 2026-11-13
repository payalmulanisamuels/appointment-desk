// A small "nothing to show" box: icon, title and a helpful message.
// It is reusable: AppointmentList decides WHICH title and message to pass in.
export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      {/* Simple calendar icon drawn with SVG (no image file or icon library needed) */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
