const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const toDoSchema = new Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const ToDo = model("ToDo", toDoSchema);
exports.ToDo = ToDo;
