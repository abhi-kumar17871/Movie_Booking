const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
  title: String,
  content: String,
  language: String,
  genre: String,
});

module.exports = mongoose.model("filter", filterSchema);
