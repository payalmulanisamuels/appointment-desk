// Everything that touches the browser's localStorage lives in this one file.
// localStorage can only store TEXT, so we convert the array to JSON text when
// saving, and convert the JSON text back into an array when loading.

const STORAGE_KEY = "appointments";

// The fields every appointment MUST have as text. The rest of the app (dates,
// sorting, search) relies on these, so an item without them would crash the page.
const REQUIRED_FIELDS = ["id", "patientName", "phone", "service", "date", "time", "status", "source"];

// true only for a complete appointment object
function isCompleteAppointment(item) {
  return (
    typeof item === "object" &&
    item !== null &&
    REQUIRED_FIELDS.every((field) => typeof item[field] === "string")
  );
}

// Read the saved appointments. Always returns an array (empty if nothing is saved).
// Incomplete items (edited by hand, or saved by an older version of the app) are
// skipped instead of crashing the page. The SAVE effect in page.js then writes the
// cleaned list back, so the damaged data is repaired automatically.
export function loadAppointments() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (!savedText) return [];

    const savedList = JSON.parse(savedText);
    if (!Array.isArray(savedList)) return [];

    return savedList.filter(isCompleteAppointment);
  } catch {
    // The saved text was broken (or storage is blocked): start with an empty list
    // instead of crashing the whole page.
    return [];
  }
}

// Save the full appointments array, replacing whatever was saved before.
export function saveAppointments(appointments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // Storage can be full or blocked (e.g. some private-browsing modes).
    // The app keeps working for this visit; it just can't save.
  }
}
