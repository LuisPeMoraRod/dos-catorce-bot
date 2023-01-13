const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true },
  isCreatingToDo: { type: Boolean, default: false },
  editingToDo: { type: String, default: null },
  collegeSchedule: { type: String, default: "🐮ciones" },
  editingSchedule: { type: String, default: null },
  lastMessageID: { type: Number },
  lastMessageData: { type: String },
});

const User = model("User", userSchema);
exports.User = User;
