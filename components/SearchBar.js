// The search box. Like FilterTabs, it shows a value owned by page.js (searchText)
// and reports every keystroke back up with onSearchChange.
export default function SearchBar({ searchText, onSearchChange }) {
  return (
    <div>
      {/* sr-only: the label is read by screen readers but not shown on screen */}
      <label htmlFor="search" className="sr-only">
        Search appointments
      </label>
      <input
        id="search"
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by patient name or phone"
        // text-base on phones stops iPhone Safari zooming in when the box is tapped
        className="block min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 sm:text-sm placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
      />
    </div>
  );
}
