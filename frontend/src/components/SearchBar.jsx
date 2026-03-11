export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex-1 relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search links..."
        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
