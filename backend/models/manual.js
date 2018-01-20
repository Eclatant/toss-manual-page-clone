const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const manualSchema = new mongoose.Schema({
  value: String,
  order: Number
});

manualSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Manual", manualSchema);
