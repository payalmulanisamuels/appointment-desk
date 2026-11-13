"use client"; // this page uses state, effects and localStorage, so it must run in the browser

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import AppointmentForm from "@/components/AppointmentForm";
import AppointmentList from "@/components/AppointmentList";
import FilterTabs from "@/components/FilterTabs";
import SearchBar from "@/components/SearchBar";
import SummaryCards from "@/components/SummaryCards";
import { loadAppointments, saveAppointments } from "@/utils/storage";
import {
  filterAppointments,
  getSummaryCounts,
  getTodayDateString,
  sortAppointments,
} from "@/utils/appointmentHelpers";

// The home page ("/") and THE BRAIN of the app:
// it owns the appointments array and every function that changes it.
export default function HomePage() {
  // The single source of truth: every appointment lives in this array.
  const [appointments, setAppointments] = useState([]);

  // false until we have read localStorage (which only exists in the browser).
  const [isLoaded, setIsLoaded] = useState(false);

  // Which filter tab is selected, and what is typed in the search box.
  // These only change what is SHOWN, never the saved appointments.
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

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

  // The list to SHOW, worked out fresh on every render. It is never stored
  // separately, so it can never get out of date with the real appointments.
  // Order: filter by tab → filter by search → sort soonest first.
  const visibleAppointments = sortAppointments(
    filterAppointments(appointments, activeFilter, searchText, today)
  );

  // Today's numbers for the summary cards, also worked out fresh on every render,
  // so they change the moment an appointment is added or a status changes.
  // (null until loaded: the cards show "–" instead of a misleading 0.)
  const summaryCounts = isLoaded ? getSummaryCounts(appointments, today) : null;

  // Called by AppointmentForm when a valid appointment is submitted.
  function handleAddAppointment(newAppointment) {
    setAppointments((currentList) => [...currentList, newAppointment]);
  }

  // Called by an AppointmentCard button, e.g. handleStatusChange("abc-123", "Confirmed").
  // .map() builds a NEW array: the matching appointment is copied with the new status,
  // every other appointment is kept exactly as it was.
  function handleStatusChange(appointmentId, newStatus) {
    setAppointments((currentList) =>
      currentList.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      )
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Row 1: today's summary numbers */}
        <SummaryCards counts={summaryCounts} />

        {/* Row 2: form on the left, list on the right from 1280px up.
            Below 1280px they stack, so the list gets the full width for its columns. */}
        <div className="grid items-start gap-6 xl:grid-cols-[360px_1fr]">
          <AppointmentForm
            appointments={appointments}
            today={today}
            onAddAppointment={handleAddAppointment}
          />

          <AppointmentList
            appointments={visibleAppointments}
            totalCount={appointments.length}
            activeFilter={activeFilter}
            searchText={searchText}
            isLoaded={isLoaded}
            onStatusChange={handleStatusChange}
          >
            <SearchBar searchText={searchText} onSearchChange={setSearchText} />
            <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </AppointmentList>
        </div>
      </main>
    </div>
  );
}
