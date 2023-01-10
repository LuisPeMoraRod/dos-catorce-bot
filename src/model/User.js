const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  isCreatingToDo: Boolean,
});

const User = model("User", userSchema);
exports.User = User;
