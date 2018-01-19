const mongoose = require("mongoose");

const manualSchema = new mongoose.Schema({
  title: String,
  content: String
});

module.exports = mongoose.model("Manual", manualSchema);
