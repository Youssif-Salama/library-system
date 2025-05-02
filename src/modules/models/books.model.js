import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      description: String,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    type: {
      type: String,
      Enum: ["fiction", "non-fiction", "biography", "science", "history"],
      required: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
