// The white bar at the top of the dashboard: clinic name, page title, and the
// "Load Sample Data" and "Clear All" buttons. The buttons only call functions
// from page.js; the header itself never changes any appointments.
export default function DashboardHeader({
  canLoadSample,
  canClearAll,
  onLoadSampleData,
  onClearAll,
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      {/* Title on the left, buttons on the right. On phones the buttons wrap below. */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {/* Small logo square with the clinic's initials */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
            SC
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Appointment Desk
            </h1>
            <p className="text-sm text-slate-500">Samuels Consultancy · Clinic reception</p>
          </div>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            onClick={onLoadSampleData}
            disabled={!canLoadSample}
            className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            Load Sample Data
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={!canClearAll} // nothing to clear → button is greyed out
            className="min-h-10 flex-1 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            Clear All
          </button>
        </div>
      </div>
    </header>
  );
}
