const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    injuries: { type: Number, default: 0 },
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    team: { type: String, default: "Youth Academy" },
    position: {
      type: String,
      enum: ["ST", "CM", "CB", "GK", "RB"],
      required: true,
    },
    img: { type: String, default: "" },
    video: { type: String, default: "" },
    stats: { type: statsSchema, default: () => ({}) },
    rating: { type: [Number], default: [60, 65, 70, 75, 80] },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
