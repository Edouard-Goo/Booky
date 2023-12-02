import mongoose from "mongoose";
import bcrypt from "bcrypt";

let userSchema = mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    age: Number,
    password: { type: String, required: true, minLength: 8, maxLength: 30 },
    image: String,

    role: { type: String, default: "User" },
    wishList: [],

    booksRead: [{ booksId: String }],

    inProgressBooks: [
      {
        booksId: mongoose.Types.ObjectId,

        page: Number,
      },
    ],
  },
  { timestamps: true }
);

//HOOK of Mongoose for hashing the PWD

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

let User = mongoose.model("User", userSchema);

export default User;
