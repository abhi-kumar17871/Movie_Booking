const router = require("express").Router();
const Filter = require("../models/filter");

router.get("/api/movies/filter", async (req, res) => {
  try {
    const { language, genre } = req.query;
    let query = {};

    if (language) {
      query.language = language;
    }

    if (genre) {
      query.genre = genre;
    }

    const filters = await Filter.find(query);
    res.json(filters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
