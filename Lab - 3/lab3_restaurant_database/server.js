const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", restaurantRoutes);

console.log("USING MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });

})
.catch(err => console.log(err));
