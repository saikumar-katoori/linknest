const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    index: true,
  },
  url: {
    type: String,
    required: [true, "URL is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    index: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search performance
linkSchema.index({ title: "text", tags: "text" });

module.exports = mongoose.model("Link", linkSchema);
