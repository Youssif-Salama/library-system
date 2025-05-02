import mongoose from "mongoose";
const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    age: {
      type: Number,
      required: true,
    },
    membershipType: {
      type: String,
      enum: ["regular", "premium", "vip"],
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
