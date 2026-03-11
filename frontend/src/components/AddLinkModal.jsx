import { useState, useEffect } from "react";
import { createLink, updateLink } from "../api";
import toast from "react-hot-toast";

export default function AddLinkModal({ link, categories, onClose, onSaved }) {
  const isEditing = !!link;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (link) {
      setTitle(link.title || "");
      setUrl(link.url || "");
      setCategory(link.category || "");
      setTags(link.tags?.join(", ") || "");
    }
  }, [link]);

  const validate = () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return false;
    }
    if (!url.trim()) {
      toast.error("URL is required.");
      return false;
    }
    try {
      new URL(url);
    } catch {
      toast.error("Invalid URL. Include http:// or https://");
      return false;
    }
    if (!category) {
      toast.error("Category is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      url: url.trim(),
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await updateLink(link._id, payload);
        toast.success("Link updated!");
      } else {
        await createLink(payload);
        toast.success("Link added!");
      }
      onSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-textPrimary mb-6">
          {isEditing ? "Edit Link" : "Add New Link"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-textSecondary text-sm mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-4 py-2.5 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
              placeholder="Google STEP Internship"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-textSecondary text-sm mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-4 py-2.5 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
              placeholder="https://careers.google.com"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-textSecondary text-sm mb-1">Category</label>
            <input
              type="text"
              list="category-list"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-4 py-2.5 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
              placeholder="Type or pick a category"
            />
            <datalist id="category-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-textSecondary text-sm mb-1">
              Tags <span className="text-textSecondary/60">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-4 py-2.5 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
              placeholder="Google, AI, Remote"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-textSecondary hover:text-textPrimary hover:border-textSecondary py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Link"
                : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
