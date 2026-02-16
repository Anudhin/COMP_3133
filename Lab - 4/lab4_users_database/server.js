require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const usersRoute = require("./routes/users");

const app = express();
app.use(express.json());

app.use("/users", usersRoute);

const PORT = process.env.PORT || 8081;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));
