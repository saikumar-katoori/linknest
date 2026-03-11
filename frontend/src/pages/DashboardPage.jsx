import { useState, useEffect, useCallback } from "react";
import { getLinks, deleteLink as deleteLinkApi, getCategories as getCategoriesApi } from "../api";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LinkCard from "../components/LinkCard";
import AddLinkModal from "../components/AddLinkModal";

export default function DashboardPage({ isAdmin, onLogout, onLoginClick }) {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // Fetch links from backend
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const { data } = await getLinks(params);
      setLinks(data);
    } catch (error) {
      toast.error("Failed to fetch links.");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getCategoriesApi();
      setCategories(data);
    } catch {
      // Non-critical: leave categories as-is
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const debounce = setTimeout(fetchLinks, 300);
    return () => clearTimeout(debounce);
  }, [fetchLinks]);

  // Delete a link
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await deleteLinkApi(id);
      toast.success("Link deleted.");
      fetchLinks();
    } catch {
      toast.error("Failed to delete link.");
    }
  };

  // Open edit modal
  const handleEdit = (link) => {
    setEditingLink(link);
    setShowModal(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingLink(null);
    setShowModal(true);
  };

  // After save — refresh list and categories
  const handleSaved = () => {
    setShowModal(false);
    setEditingLink(null);
    fetchLinks();
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">🔗 LinkNest</h1>
          {isAdmin ? (
            <button
              onClick={onLogout}
              className="text-textSecondary hover:text-textPrimary transition-colors text-sm border border-border rounded-lg px-4 py-2 hover:border-accent/50"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-accent hover:text-accent/80 transition-colors text-sm border border-accent/40 rounded-lg px-4 py-2 hover:bg-accent/10"
            >
              Admin Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section: Search, Filter, Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={setCategory}
          />
          {isAdmin && (
            <button
              onClick={handleAdd}
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-6 py-3 rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Link
            </button>
          )}
        </div>

        {/* Link count */}
        <div className="mb-6 text-textSecondary text-sm">
          {loading ? "Loading..." : `${links.length} link${links.length !== 1 ? "s" : ""} found`}
        </div>

        {/* Links Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-6 animate-pulse"
              >
                <div className="h-5 bg-border rounded w-3/4 mb-4" />
                <div className="h-4 bg-border rounded w-1/3 mb-6" />
                <div className="h-8 bg-border rounded w-full" />
              </div>
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-20 text-textSecondary">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">No links found.</p>
            <p className="text-sm mt-2">Try adjusting your search or add a new link.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard
                key={link._id}
                link={link}
                isAdmin={isAdmin}
                onEdit={() => handleEdit(link)}
                onDelete={() => handleDelete(link._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddLinkModal
          link={editingLink}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingLink(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
