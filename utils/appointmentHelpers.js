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

// ----- Validation -----
// Checks the form data and returns an "errors" object.
// Each key is a field name, each value is the message to show under that field.
// An EMPTY object {} means the form is valid.
export function validateAppointment(formData) {
  const errors = {};

  if (formData.patientName.trim() === "") {
    errors.patientName = "Patient name is required.";
  }

  if (formData.phone.trim() === "") {
    errors.phone = "Phone number is required.";
  }

  if (formData.date === "") {
    errors.date = "Date is required.";
  }

  if (formData.time === "") {
    errors.time = "Time is required.";
  }

  return errors;
}
