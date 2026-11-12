import DashboardHeader from "@/components/DashboardHeader";

// The home page ("/") of the app.
// Feature 1 builds only the LAYOUT: the dashed boxes show where each
// feature will go. Each later feature replaces one box with a real component.
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Row 1: summary cards (feature 7) */}
        <PlaceholderBox title="Summary cards" note="Feature 7: today's counts" />

        {/* Row 2: form on the left, list on the right (stacked on smaller screens) */}
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <PlaceholderBox
            title="New appointment form"
            note="Features 2 & 3: add + validation"
          />
          <PlaceholderBox
            title="Appointments"
            note="Features 4–6 & 8: list, status, filters, search, empty states"
          />
        </div>
      </main>
    </div>
  );
}

// Temporary helper used only in feature 1. It is deleted once all boxes are replaced.
function PlaceholderBox({ title, note }) {
  return (
    <section className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6">
      <h2 className="font-semibold text-slate-700">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </section>
  );
}
