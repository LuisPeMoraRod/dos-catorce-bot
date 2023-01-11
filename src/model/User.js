const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true },
  isCreatingToDo: { type: Boolean, default: false },
});

const User = model("User", userSchema);
exports.User = User;
