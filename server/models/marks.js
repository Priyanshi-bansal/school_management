import mongoose from "mongoose";
const { Schema } = mongoose;

const marksSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: "Test",
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  marks: {
    type: Number,
    default: -1,
  },
});

export default mongoose.model("Marks", marksSchema);
