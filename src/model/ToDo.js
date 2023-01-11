const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const toDoSchema = new Schema({
  title: { type: String, unique: true },
  description: String,
  isCompleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const ToDo = model("ToDo", toDoSchema);
exports.ToDo = ToDo;
