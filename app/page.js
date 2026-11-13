"use client"; // this page uses state, effects and localStorage, so it must run in the browser

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import AppointmentForm from "@/components/AppointmentForm";
import { loadAppointments, saveAppointments } from "@/utils/storage";
import { getTodayDateString } from "@/utils/appointmentHelpers";

// The home page ("/") and THE BRAIN of the app:
// it owns the appointments array and every function that changes it.
export default function HomePage() {
  // The single source of truth: every appointment lives in this array.
  const [appointments, setAppointments] = useState([]);

  // false until we have read localStorage (which only exists in the browser).
  const [isLoaded, setIsLoaded] = useState(false);

  // 1) LOAD once, after the page first appears in the browser.
  //    localStorage does not exist on the server, so this cannot happen during the
  //    first render; an effect is the place for it. React's lint rule warns about
  //    setState inside effects in general, so we switch it off for this one line.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage
    setAppointments(loadAppointments());
    setIsLoaded(true);
  }, []);

  // 2) SAVE every time the appointments array changes.
  //    The isLoaded check stops the empty starting [] from overwriting saved data.
  useEffect(() => {
    if (isLoaded) {
      saveAppointments(appointments);
    }
  }, [appointments, isLoaded]);

  // Today's date, calculated only in the browser (after loading). On the server it
  // stays undefined, so the server HTML and the first browser HTML always match.
  const today = isLoaded ? getTodayDateString() : undefined;

  // Called by AppointmentForm when a valid appointment is submitted.
  function handleAddAppointment(newAppointment) {
    setAppointments((currentList) => [...currentList, newAppointment]);
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Row 1: summary cards (feature 7) */}
        <PlaceholderBox title="Summary cards" note="Feature 7: today's counts" />

        {/* Row 2: form on the left, list on the right (stacked on smaller screens) */}
        <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
          <AppointmentForm
            appointments={appointments}
            today={today}
            onAddAppointment={handleAddAppointment}
          />

          <PlaceholderBox
            title="Appointments"
            note={
              isLoaded
                ? `${appointments.length} appointment(s) saved. The list arrives in feature 4.`
                : "Loading appointments…"
            }
          />
        </div>
      </main>
    </div>
  );
}

// Temporary helper. It is deleted once all boxes are replaced by real components.
function PlaceholderBox({ title, note }) {
  return (
    <section className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6">
      <h2 className="font-semibold text-slate-700">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </section>
  );
}
