const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./schema");

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Error connecting to database:", error));

// POST API Endpoint to create user
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.validate(); // Validate before saving

    const savedUser = await user.save();
    res.status(201).json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.message });
    }
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
