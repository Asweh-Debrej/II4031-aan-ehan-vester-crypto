import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  grade: { type: String, required: true },
  credit: { type: Number, required: true },
});

const transcriptSchema = new Schema({
  nim: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  courses: [courseSchema],
  gpa: { type: Number, required: true },
  signature: { type: String, required: true },
});

const Course = mongoose.model("Course", courseSchema);
const Transcript = mongoose.model("Transcript", transcriptSchema);

module.exports = { Course, Transcript };
