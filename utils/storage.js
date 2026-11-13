// Everything that touches the browser's localStorage lives in this one file.
// localStorage can only store TEXT, so we convert the array to JSON text when
// saving, and convert the JSON text back into an array when loading.

const STORAGE_KEY = "appointments";

// Read the saved appointments. Always returns an array (empty if nothing is saved).
export function loadAppointments() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (!savedText) return [];

    const savedList = JSON.parse(savedText);
    return Array.isArray(savedList) ? savedList : [];
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
