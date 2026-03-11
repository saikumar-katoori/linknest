/**
 * Seed script — creates the admin user if not already present.
 * Run: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingUser) {
      console.log("Admin user already exists. Skipping seed.");
    } else {
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`Admin user created: ${process.env.ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    console.log("Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seed();
