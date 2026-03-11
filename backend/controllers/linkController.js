const validator = require("validator");
const Link = require("../models/Link");

// POST /links — Create a new link
const createLink = async (req, res) => {
  try {
    const { title, url, category, tags } = req.body;

    // Validation
    if (!title || !url || !category) {
      return res.status(400).json({ message: "Title, URL, and category are required." });
    }

    if (!validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ message: "Invalid URL. Must include protocol (http/https)." });
    }

    const link = await Link.create({
      title: title.trim(),
      url: url.trim(),
      category,
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()) : [],
    });

    res.status(201).json(link);
  } catch (error) {
    console.error("Create link error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /links — Get all links with optional search & category filter
const getLinks = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter — partial match on title (case-insensitive)
    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: sanitized, $options: "i" };
    }

    const links = await Link.find(filter).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error("Get links error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /links/:id — Update a link
const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, category, tags } = req.body;

    // Validate URL if provided
    if (url && !validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ message: "Invalid URL." });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (url) updateData.url = url.trim();
    if (category) updateData.category = category;
    if (tags) updateData.tags = Array.isArray(tags) ? tags.map((t) => t.trim()) : [];

    const link = await Link.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!link) {
      return res.status(404).json({ message: "Link not found." });
    }

    res.json(link);
  } catch (error) {
    console.error("Update link error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /links/:id — Delete a link
const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findByIdAndDelete(id);

    if (!link) {
      return res.status(404).json({ message: "Link not found." });
    }

    res.json({ message: "Link deleted successfully." });
  } catch (error) {
    console.error("Delete link error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// GET /links/categories — Get all distinct categories
const getCategories = async (req, res) => {
  try {
    const categories = await Link.distinct("category");
    res.json(categories.sort());
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createLink, getLinks, updateLink, deleteLink, getCategories };
