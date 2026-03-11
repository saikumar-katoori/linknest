const CATEGORY_COLORS = {
  Internship: "bg-blue-500/20 text-blue-400",
  Courses: "bg-purple-500/20 text-purple-400",
  Education: "bg-green-500/20 text-green-400",
  Information: "bg-cyan-500/20 text-cyan-400",
  Entertainment: "bg-pink-500/20 text-pink-400",
  Food: "bg-orange-500/20 text-orange-400",
  Tools: "bg-yellow-500/20 text-yellow-400",
  Research: "bg-indigo-500/20 text-indigo-400",
};

export default function LinkCard({ link, isAdmin, onEdit, onDelete }) {
  const colorClass = CATEGORY_COLORS[link.category] || "bg-gray-500/20 text-gray-400";

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group flex flex-col">
      {/* Title */}
      <h3 className="text-lg font-semibold text-textPrimary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
        {link.title}
      </h3>

      {/* Category Badge */}
      <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full w-fit mb-4 ${colorClass}`}>
        {link.category}
      </span>

      {/* Tags */}
      {link.tags && link.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {link.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-primary text-textSecondary px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* URL preview */}
      <p className="text-textSecondary text-xs truncate mb-4" title={link.url}>
        {link.url}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-accent/10 text-accent hover:bg-accent/20 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Open Link
        </a>
        {isAdmin && (
          <>
            <button
              onClick={onEdit}
              className="px-3 py-2 bg-border/50 text-textSecondary hover:text-textPrimary hover:bg-border rounded-lg text-sm transition-colors"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
