const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createLink,
  getLinks,
  updateLink,
  deleteLink,
  getCategories,
} = require("../controllers/linkController");

const router = express.Router();

// Public routes
router.get("/", getLinks);
router.get("/categories", getCategories);

// Write operations require admin auth
router.post("/", authMiddleware, createLink);
router.put("/:id", authMiddleware, updateLink);
router.delete("/:id", authMiddleware, deleteLink);

module.exports = router;
