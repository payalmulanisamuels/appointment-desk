// The white bar at the top of the dashboard: clinic name and page title.
// The "Load Sample Data" and "Clear All" buttons are added here in feature 9.
export default function DashboardHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        {/* Small logo square with the clinic's initials */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
          SC
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Appointment Desk
          </h1>
          <p className="text-sm text-slate-500">
            Samuels Consultancy · Clinic reception
          </p>
        </div>
      </div>
    </header>
  );
}
