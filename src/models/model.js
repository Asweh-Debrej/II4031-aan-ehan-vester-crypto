import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  nim: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  rsaPublicE: {
    type: String,
    required: true,
  },
  rsaPublicN: {
    type: String,
    required: true,
  },
  courses: [
    {
      code: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      grade: {
        type: String,
        required: true,
      },
      credit: {
        type: String,
        required: true,
      },
    },
  ],
});

const Student = mongoose.models?.Student || mongoose.model("Student", studentSchema);

export default Student;
