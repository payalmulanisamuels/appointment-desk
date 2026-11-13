import { useState } from "react";
import {
  SERVICES,
  SOURCES,
  createAppointmentId,
  validateAppointment,
} from "@/utils/appointmentHelpers";

// What the form looks like when it is empty (first load, and after each reset)
const EMPTY_FORM = {
  patientName: "",
  phone: "",
  service: "Consultation",
  date: "",
  time: "",
  source: "Phone",
  notes: "",
};

// The "New appointment" form.
// It only keeps TEMPORARY data (what is being typed). When the form is valid it
// hands the finished appointment to its parent by calling onAddAppointment().
// Props from page.js:
// - appointments: the current list (needed for the double-booking check)
// - today: today's date "YYYY-MM-DD" (only known once we are in the browser)
// - onAddAppointment: function to call with the new appointment
export default function AppointmentForm({ appointments, today, onAddAppointment }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Runs on every keystroke / selection in ANY field.
  // The input's "name" attribute tells us which field changed.
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // Hide this field's error while editing. Changing the date also hides the time
    // error, because "slot already booked" may no longer be true for the new date.
    if (name === "date") {
      setErrors({ ...errors, date: "", time: "" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
    setSuccessMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    const newErrors = validateAppointment(formData, appointments);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // show messages under the wrong fields, add nothing
      return;
    }

    const newAppointment = {
      id: createAppointmentId(),
      patientName: formData.patientName.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      date: formData.date,
      time: formData.time,
      status: "Booked", // every new appointment starts as Booked
      source: formData.source,
      notes: formData.notes.trim(),
      isSample: false,
    };

    onAddAppointment(newAppointment); // tell page.js: "please add this"

    setSuccessMessage(`Appointment for ${newAppointment.patientName} added.`);
    setFormData(EMPTY_FORM);
    setErrors({});
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">New appointment</h2>
      <p className="mt-1 text-sm text-slate-500">
        Fields marked <span className="text-red-600">*</span> are required.
      </p>

      {/* noValidate: we show our own messages instead of the browser's pop-ups */}
      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        <FormField label="Patient name" htmlFor="patientName" required error={errors.patientName}>
          <input
            id="patientName"
            name="patientName"
            type="text"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="e.g. Priya Sharma"
            className={inputClasses(errors.patientName)}
          />
        </FormField>

        <FormField label="Phone number" htmlFor="phone" required error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className={inputClasses(errors.phone)}
          />
        </FormField>

        <FormField label="Service" htmlFor="service">
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={inputClasses()}
          >
            {SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </FormField>

        {/* Date and time side by side (on very small screens too: both are short) */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date" htmlFor="date" required error={errors.date}>
            <input
              id="date"
              name="date"
              type="date"
              min={today} // greys out past days in the date picker (validation is the real rule)
              value={formData.date}
              onChange={handleChange}
              className={inputClasses(errors.date)}
            />
          </FormField>

          <FormField label="Time" htmlFor="time" required error={errors.time}>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className={inputClasses(errors.time)}
            />
          </FormField>
        </div>

        <FormField label="Source" htmlFor="source">
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={inputClasses()}
          >
            {SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Notes" htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional"
            className={inputClasses()}
          />
        </FormField>

        {/* Status is not chosen by the receptionist: it is always Booked at first */}
        <p className="text-sm text-slate-500">
          Status: <span className="font-medium text-slate-700">Booked</span>{" "}
          (set automatically)
        </p>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Add Appointment
        </button>

        {successMessage && (
          <p
            role="status"
            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
          >
            {successMessage}
          </p>
        )}
      </form>
    </section>
  );
}

// One label + one input + its error message. Used by every field above,
// so the layout and error style are written only once.
function FormField({ label, htmlFor, required = false, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Tailwind classes for inputs. A red border is added when the field has an error.
// Phones: 16px text (text-base), because iPhone Safari zooms the whole page in
// when you tap an input with smaller text, and at least 40px tall (min-h-10)
// for easy tapping. From 640px up (sm:) the text is the more compact 14px.
function inputClasses(error) {
  const base =
    "block min-h-10 w-full rounded-lg border bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:text-sm";
  return error
    ? `${base} border-red-400 focus:ring-red-200`
    : `${base} border-slate-300 focus:border-teal-500 focus:ring-teal-100`;
}
