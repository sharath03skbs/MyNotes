const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId, //To link the notes with a user (Foreign key)
    ref : 'user'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("notes", NotesSchema);
module.exports = Note;
