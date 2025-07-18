import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //us Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //us Cloudinary url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshTokens: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatAccessToken = function () {
  jwt.sign({
    _id: this._id,
    email: this.email,
    userName: this.userName,
    fullName: this.fullName,
  },process.env.ACCESS_TOKEN_SECRET,
  {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
};
userSchema.methods.generatRefreshToken = function () {
    jwt.sign({
    _id: this._id,
  },process.env.REFRESH_TOKEN_SECRET,
  {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
};
export const User = mongoose.model("User", userSchema);
