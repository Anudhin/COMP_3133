const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

/**
 * 4) GET all restaurants (all columns)
 * GET /restaurants
 * ALSO handles #6 when sortBy is passed
 */
router.get("/restaurants", async (req, res) => {
  try {
    const { sortBy } = req.query;

    // #6) /restaurants?sortBy=ASC|DESC
    if (sortBy) {
      const order = sortBy.toUpperCase() === "DESC" ? -1 : 1;

      // selected columns: id, cuisines, name, city, resturant_id
      // (city mapped to borough)
      const data = await Restaurant.find(
        {},
        {
          _id: 1,              // id
          cuisine: 1,          // cuisines
          name: 1,
          borough: 1,          // city (mapped)
          restaurant_id: 1     // resturant_id
        }
      ).sort({ restaurant_id: order });

      return res.json(data);
    }

    // #4) all columns
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 5) GET restaurants by cuisine (all columns)
 * GET /restaurants/cuisine/:cuisine
 */
router.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const data = await Restaurant.find({ cuisine });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 7) cuisine = Delicatessen AND city != Brooklyn
 * selected columns: cuisines, name, city (exclude id)
 * sort: name ASC
 * GET /restaurants/Delicatessen
 */
router.get("/restaurants/Delicatessen", async (req, res) => {
  try {
    const data = await Restaurant.find(
      { cuisine: "Delicatessen", borough: { $ne: "Brooklyn" } }, // city mapped to borough
      { _id: 0, cuisine: 1, name: 1, borough: 1 }               // exclude id
    ).sort({ name: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
