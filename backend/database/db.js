const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Use default values if .env is not available
    const mongoUri = "mongodb+srv://gel0om0o:V1wkL0UxwHHHXb7s@cluster0.be9cawk.mongodb.net/"
    const jwtSecret = process.env.JWT_SECRET || "default-jwt-secret-change-in-production";

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed admin user if it doesn't exist
    await seedAdminUser();
    
    // Return the connection to indicate success
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.log("Make sure MongoDB is running on your system");
    console.log("You can start MongoDB with: mongod");
    throw error; // Re-throw the error instead of process.exit
  }
};

const seedAdminUser = async () => {
  try {
    const User = require("../models/user.model");
    const bcrypt = require("bcryptjs");

    const adminExists = await User.findOne({ username: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin user seeded successfully");
      console.log("Username: admin, Password: admin123");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

module.exports = connectDB;
