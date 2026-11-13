# PLAN — Samuels Consultancy Appointment Desk (FS Round 1)

## Context

A clinic receptionist needs one screen to manage appointments: add a booking, see what is coming up, and move each booking through its statuses. This is the first full-stack-track build for Payal (strong in HTML/CSS/JS/Shopify, new to React/Next.js). The app must be a real working Next.js app, saved in the browser with localStorage (no database yet: Round 2 adds one), pushed to GitHub, deployed on Vercel, and fully explainable by Payal to her mentor Raj.

**Project folder:** `E:\samuel-app\fs-projects\appointment-desk` (empty right now).
**Toolkit checked:** Node 24.21, npm 11.19, Git 2.50, Claude Code: all working. `gh` (GitHub CLI) was missing at first. It was installed during planning and is logged in to GitHub over HTTPS.

## Decisions (all approved as recommended)

| # | Decision | Choice |
|---|---|---|
| 1 | Styling | **Tailwind CSS** (comes with create-next-app) |
| 2 | Summary card counts | **Today's appointments only**, labelled "Today" on every card |
| 3 | Cancelled slot | **Frees the slot.** No-show keeps it |
| 4 | Status buttons | Booked → *Confirm*; Confirmed → *Complete*; *Cancel* and *No-show* while Booked or Confirmed. Completed / Cancelled / No-show are final (no buttons) |
| 5 | Past times today | Rejected, the same as past dates |
| 6 | "Upcoming" tab | Dates **after today** (tomorrow onward). Does not overlap "Today" |
| 7 | Sample data dates | **Relative to today** (some today, some on the next few days). Fixed IDs `sample-1`…`sample-8` prevent duplicates |
| 8 | Clear All | Uses the browser's built-in `window.confirm()` dialog. Removes **all** appointments (sample + real) |

## Tech stack

Next.js (latest, App Router) · JavaScript only · React function components + hooks (`useState`, `useEffect`) · Tailwind CSS · browser localStorage · Git + GitHub · Vercel. No other libraries.

## Folder structure

```
appointment-desk/
├── app/
│   ├── layout.js        HTML shell + page <title>. Stays a server component.
│   ├── page.js          "use client". THE BRAIN: holds all state, add / status / sample / clear handlers, filtering
│   └── globals.css      Tailwind import + body background
├── components/
│   ├── DashboardHeader.js   Clinic title, today's date, Load Sample Data + Clear All buttons, notice message
│   ├── SummaryCards.js      5 cards: Today's Total, Booked, Confirmed, Completed, Cancelled / No-show
│   ├── AppointmentForm.js   8 fields, own form state + error messages, success message, reset
│   ├── FilterTabs.js        All · Today · Upcoming · Booked · Confirmed · Completed · Cancelled · No-show
│   ├── SearchBar.js         Search by patient name or phone
│   ├── AppointmentList.js   Desktop column header + one AppointmentCard per item, or EmptyState / loading text
│   ├── AppointmentCard.js   One appointment: table row on desktop, stacked card on mobile (CSS Grid). Status buttons
│   ├── StatusBadge.js       Coloured pill per status
│   └── EmptyState.js        Reusable icon + title + message box
├── utils/
│   ├── appointmentHelpers.js  Constants, date helpers, validation, double-booking, sort, filter, counts, sample data
│   └── storage.js             loadAppointments() / saveAppointments() with try/catch
├── PLAN.md              this file
└── README.md            written by Payal in her own words at the end
```

The files create-next-app generates and we don't need (e.g. demo SVGs in `public/`) get deleted in step 1. Fewer files are easier to explain.

## Data model

```js
{
  id: "c1a2…",            // crypto.randomUUID(); sample items use "sample-1"…"sample-8"
  patientName: "Priya Sharma",
  phone: "9876543210",    // exactly 10 digits, stored as text (keeps leading zeros)
  service: "Consultation", // Consultation | Follow-up | Check-up | Other
  date: "2026-11-12",     // from <input type="date">, always YYYY-MM-DD
  time: "10:30",          // from <input type="time">, always HH:MM (24h)
  status: "Booked",       // Booked | Confirmed | Completed | Cancelled | No-show
  source: "Phone",        // Phone | Walk-in | Voice AI
  notes: "",
  isSample: false         // true → shows a SAMPLE tag
}
```

Storing date and time as plain text in these formats means **text comparison = time comparison** (`"2026-11-12" < "2026-11-13"`, `"09:30" < "10:30"`). This keeps sorting and validation simple.

## State management (all in `app/page.js`)

| State | Purpose |
|---|---|
| `appointments` | The one real array: the single source of truth |
| `isLoaded` | `false` until localStorage has been read in the browser |
| `activeFilter` | Selected tab, default `"All"` |
| `searchText` | Search box text |
| `notice` | Short feedback for sample / clear actions |

**Handlers passed down as props:** `handleAddAppointment(newAppointment)`, `handleStatusChange(id, newStatus)`, `handleLoadSampleData()`, `handleClearAll()`, `setActiveFilter`, `setSearchText`.

**Derived on every render (never stored):**
`visibleAppointments = sortAppointments(filterAppointments(appointments, activeFilter, searchText))`
`summaryCounts = getSummaryCounts(appointments)`

`AppointmentForm` keeps only its own temporary state: `formData`, `errors`, `successMessage`.

**Data flow:** props go **down** (data). Callback functions go **up** (events). Children never change `appointments` directly.

## localStorage approach (`utils/storage.js` + `page.js`)

- `storage.js`: `loadAppointments()` runs `JSON.parse(localStorage.getItem("appointments"))` inside `try/catch`, and returns `[]` on missing or broken data. `saveAppointments(list)` runs `localStorage.setItem("appointments", JSON.stringify(list))`.
- In `page.js`:
  1. `useState([])` + `isLoaded = false` → the server render and first browser render match (**no hydration error**).
  2. `useEffect(() => { setAppointments(loadAppointments()); setIsLoaded(true); }, [])` → runs only in the browser, once, after mount.
  3. `useEffect(() => { if (isLoaded) saveAppointments(appointments); }, [appointments, isLoaded])` → saves on every change. The `isLoaded` guard stops the empty starting `[]` from overwriting saved data.
- Anything that depends on "today" (header date, summary counts) only renders after `isLoaded`, so server and browser HTML stay identical.
- Until `isLoaded`, the list shows "Loading appointments…" instead of an empty state flash.

## Validation approach (`validateAppointment(formData, appointments)` → `errors` object)

Runs on submit. Returns `{}` when valid, otherwise e.g. `{ phone: "…", time: "…" }`. Each error shows directly under its field (red text + red border). The error for a field is cleared when the user edits it.

| Field | Rule | Message |
|---|---|---|
| patientName | `trim()` not empty | "Patient name is required." |
| phone | `/^\d{10}$/` on trimmed value | "Phone number must be exactly 10 digits." |
| date | required; not before `getTodayDateString()` | "Date is required." / "Date cannot be in the past." |
| time | required; if date is today, not before current time | "Time is required." / "This time has already passed today." |
| time (slot) | `findBookingAtSlot()` finds a non-cancelled booking | "This time slot is already booked (12 Nov 2026 at 10:30 AM). Please select another time." |

**Double-booking check:**
```js
export function findBookingAtSlot(appointments, date, time) {
  return appointments.find(
    (appt) => appt.date === date && appt.time === time && appt.status !== "Cancelled"
  );
}
```

**Date helpers use LOCAL time**, never `toISOString()` (which is UTC and returns yesterday's date in India before 5:30 AM). `getTodayDateString()` builds `YYYY-MM-DD` from `getFullYear / getMonth / getDate`. The date input also gets `min={today}` as a convenience, but the JS check is the real rule.

## Filtering, search and sorting (`appointmentHelpers.js`)

- `filterAppointments(list, activeFilter, searchText)`: step 1 is the tab filter: All → everything; Today → `date === today`; Upcoming → `date > today`; a status name → `status === tab`. Step 2 narrows by search: name `toLowerCase().includes()`, or phone `includes()`. **The two steps run one after the other, so tab + search always work together.**
- `sortAppointments(list)`: `[...list].sort()` by `date`, then `time`, soonest first. It copies first so state is never mutated.
- `getSummaryCounts(appointments)`: filters to today, then counts the total, Booked, Confirmed, Completed, and Cancelled + No-show.
- `getStatusActions(status)`: returns the buttons a card should show (decision 4).

## Empty states (one reusable `EmptyState` component, different text)

Checked in this order:
1. No appointments at all → "No appointments yet. Add one using the form, or load sample data."
2. Search has text and nothing matches → "No appointments match "<text>" in <tab>."
3. Today tab empty → "No appointments for today."
4. Upcoming tab empty → "No upcoming appointments."
5. Status tab empty → "No <status> appointments."

The box is compact (no large blank area).

## Sample data

`createSampleAppointments()` returns 8 items with IDs `sample-1`…`sample-8`, realistic Indian names and 10-digit numbers, all 4 services, all 3 sources, and every status. Dates are today (4 items: Completed, Confirmed, Booked, No-show), today + 1, + 2 and + 3 (Booked, Confirmed, Cancelled, Booked). All are tagged `isSample: true`, which shows a grey **SAMPLE** tag.

`handleLoadSampleData()` adds only the samples whose `id` is not already in the list **and** whose slot is not already taken. The notice then reads "8 sample appointments loaded" or "Sample data is already loaded."

`handleClearAll()` asks `window.confirm("Delete ALL appointments? This cannot be undone.")`. On OK → `setAppointments([])` (the save effect then writes `[]` to localStorage). On Cancel → nothing changes.

## Responsive design approach

- **≥1280px (desktop, optimised for 1440):** max-width ~1280px centred container. Header → 5 summary cards in one row → two columns: form on the left (~360px) | tabs + search + list on the right.
- **768–1279px (tablets, small laptops):** form stacked above the list, so the list gets the full width and still shows table-like rows. *(Changed in feature 4: at 1024px, with the form beside it, the list column would only be ~580px wide, too narrow for 6–7 columns.)*
- **<768px / 375px (mobile):** single column, summary cards 2 per row, filter tabs **wrap** onto extra lines (no sideways scroll), each appointment becomes a stacked card with labels, full-width form inputs and buttons (min 40px tall).
- `AppointmentCard` uses CSS Grid: a 7-column row on desktop and stacked on mobile. One component, no duplicated markup. The column header row in `AppointmentList` is hidden on mobile.
- Status badge colours: Booked blue · Confirmed indigo · Completed green · Cancelled grey · No-show amber/red.
- No animations beyond simple hover colours.

## Implementation order (one feature per step, wait for "confirmed" after each)

| # | Step | Main files | Concepts I'll teach in that step | Commit |
|---|---|---|---|---|
| 1 | Setup + layout | create-next-app, layout.js, page.js, DashboardHeader, globals.css | React, Next.js, App Router, component, frontend vs backend | Initial Next.js project setup and dashboard layout |
| 2 | Appointment form | AppointmentForm, storage.js, page.js | useState, props, callbacks, useEffect, localStorage, client-side rendering | Add appointment form |
| 3 | Validation | appointmentHelpers.js, AppointmentForm | validation flow, double-booking check | Add appointment validation |
| 4 | Appointment list | AppointmentList, AppointmentCard, StatusBadge | rendering lists, `key`, sorting without mutation | Implement appointment listing |
| 5 | Status management | AppointmentCard, page.js | immutable updates with `map` | Add appointment status management |
| 6 | Filter + search | FilterTabs, SearchBar, helpers | derived data, chained filters | Implement search and filters |
| 7 | Summary stats | SummaryCards, helpers | computed values vs stored state | Add appointment summary cards |
| 8 | Empty states | EmptyState, AppointmentList | conditional rendering | Add empty states |
| 9 | Sample + Clear | DashboardHeader, helpers, page.js | duplicate prevention, confirm dialog | Add sample data management |
| 10 | Responsive QA | all components | responsive Tailwind classes | Complete responsive dashboard |

Step 1 detail: create-next-app refuses a folder containing `PLAN.md`, so I'll move PLAN.md aside, run `npx create-next-app@latest . --js --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes`, then move PLAN.md back. I explain every command before running it.

After each step I report: files created/changed · key code explained · exact clicks to test · expected result · what failure looks like. **Commits happen only after you confirm the step works.**

## Code review (after step 10)

Strict review covering JS/React/Next.js errors, localStorage, validation, double-booking, sorting, status flow, filter + search, 375px, console errors, unnecessary code, and secrets/unwanted files. The output is a **list only**. You choose what to fix, and each fix gets its own commit.

## Deployment

1. Check `.gitignore` covers `node_modules`, `.next`, `.env*`, and that there are no secrets in the repo (the app has none).
2. `npm run build` locally must pass.
3. Create the **public** GitHub repo and push in one command: `gh repo create appointment-desk --public --source=. --push`. Every command is explained first, and run only after you approve it.
4. On vercel.com: **Add New → Project → Import** the repo → Deploy (Next.js is auto-detected, no settings needed).
5. Test the live link in incognito and run all 6 proofs at 1440 and 375. Then push a small title change to confirm automatic redeploy.

## Verification / testing strategy

- **You test manually** in the browser after every step, using my click-by-click checklist. I never claim a test passed unless it was actually run.
- I run `npm run lint` and `npm run build` myself and report the real output.
- Browser DevTools Console is checked for errors (including hydration warnings) at each step. DevTools device mode is used for 1440 / 1024 / 768 / 375.
- Final: the 6 proofs from the brief on the live link:
  1. 9-digit phone + past date refused under the field
  2. Same slot refused with the slot named
  3. Booked → Confirmed → Completed survives refresh, counts match
  4. Sample data + every tab + search inside a tab + empty state
  5. Phone at 375 with no sideways scroll
  6. A pushed change auto-redeploys
- Every bug found is written down (for the README's "Bugs I found" section).

## Out of scope (do not build)

Login, database, API routes, editing appointments, deleting single appointments, email/SMS, TypeScript, extra libraries, animations.
