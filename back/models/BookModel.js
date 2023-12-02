import mongoose from "mongoose";

let bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true, lowercase: true },
    mini_description: {
      type: String,
      lowercase: true,
    },
    notes:  [Number] ,
    pdfFile: String,
    category: { type: String, required: true, lowercase: true },
    author: { type: String, required: true, lowercase: true },
    date: Date,
    publish_year: String,
    pages: Number,
    comments: [{ pseudo: String, comment: String, date: Date }],
    image: String,
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

let Book = mongoose.model("Book", bookSchema);

export default Book;
