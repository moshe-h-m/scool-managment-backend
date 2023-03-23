const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema({
  getIn: {
    type: Date,
    required: true,
  },
  getOut: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cycle: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  isLate: {
    type: Boolean,
    required: true,
  },
  reson: {
    type: String,
  },
  sumLatesInPastDays: {
    type: Number,
    required: true,
  },
});

const Presence = mongoose.model("presence", presenceSchema);

module.exports = Presence;
