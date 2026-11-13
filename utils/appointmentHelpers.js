// Plain JavaScript helpers for appointments (no React in this file).

// ----- Dropdown options -----
export const SERVICES = ["Consultation", "Follow-up", "Check-up", "Other"];
export const SOURCES = ["Phone", "Walk-in", "Voice AI"];
export const STATUSES = ["Booked", "Confirmed", "Completed", "Cancelled", "No-show"];

// ----- Unique ID -----
// Time in milliseconds + a few random characters, e.g. "m3k9x2a-7fq2ld".
// (We don't use crypto.randomUUID() because browsers only allow it on https
// or localhost, so it would crash when testing from a phone on the local network.)
export function createAppointmentId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ----- Dates and times -----
// We store dates as "YYYY-MM-DD" and times as "HH:MM" (24-hour) text.
// In that format, comparing the TEXT gives the right answer for time too:
// "2026-11-12" < "2026-11-13" and "09:30" < "10:30".

// Adds a leading zero: 5 → "05"
function twoDigits(number) {
  return String(number).padStart(2, "0");
}

// Today's date in the receptionist's LOCAL time, e.g. "2026-11-13".
// (Not toISOString(): that uses UTC time, which in India gives YESTERDAY's
// date between midnight and 5:30 AM.)
export function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${twoDigits(now.getMonth() + 1)}-${twoDigits(now.getDate())}`;
}

// The current local time, e.g. "14:05".
export function getCurrentTimeString() {
  const now = new Date();
  return `${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}`;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11-20" → "20 Nov 2026"
export function formatDisplayDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${Number(day)} ${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

// "14:30" → "2:30 PM"
export function formatDisplayTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${twoDigits(minutes)} ${period}`;
}

// ----- Sorting -----
// Returns a NEW array sorted by date, then time: soonest appointment first.
// [...appointments] makes a copy first, because .sort() changes the array it is
// called on, and React state must never be changed directly.
export function sortAppointments(appointments) {
  return [...appointments].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date); // different days: earlier day first
    }
    return a.time.localeCompare(b.time); // same day: earlier time first
  });
}

// ----- Double-booking check -----
// Returns the appointment already booked at this date + time, or undefined if the slot is free.
// A Cancelled appointment does NOT block the slot (the patient is not coming).
export function findBookingAtSlot(appointments, date, time) {
  return appointments.find(
    (appointment) =>
      appointment.date === date &&
      appointment.time === time &&
      appointment.status !== "Cancelled"
  );
}

// ----- Validation -----
// Checks the form data and returns an "errors" object.
// Each key is a field name, each value is the message to show under that field.
// An EMPTY object {} means the form is valid.
export function validateAppointment(formData, appointments) {
  const errors = {};
  const today = getTodayDateString();

  // Rule 1: patient name cannot be empty (spaces only also counts as empty)
  if (formData.patientName.trim() === "") {
    errors.patientName = "Patient name is required.";
  }

  // Rule 2: phone must be exactly 10 digits (^ start, \d digit, {10} ten times, $ end)
  const phone = formData.phone.trim();
  if (phone === "") {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(phone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }

  // Rules 3 + 4: date is required and cannot be in the past
  if (formData.date === "") {
    errors.date = "Date is required.";
  } else if (formData.date < today) {
    errors.date = "Date cannot be in the past.";
  }

  // Rule 4: time is required, and cannot be earlier than now if the date is today
  if (formData.time === "") {
    errors.time = "Time is required.";
  } else if (formData.date === today && formData.time < getCurrentTimeString()) {
    errors.time = "This time has already passed today.";
  }

  // Rule 5: no double booking. Only checked when date and time are both fine,
  // so the receptionist sees one clear message at a time.
  if (formData.date !== "" && !errors.date && !errors.time) {
    const existingBooking = findBookingAtSlot(appointments, formData.date, formData.time);
    if (existingBooking) {
      const slot = `${formatDisplayDate(formData.date)} at ${formatDisplayTime(formData.time)}`;
      errors.time = `This time slot is already booked (${slot}). Please select another time.`;
    }
  }

  return errors;
}
