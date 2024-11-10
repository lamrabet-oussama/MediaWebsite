import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    birthDay: {
      type: String,
    },
    birthMonth: {
      type: String,
    },
    birthYear: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    profileImg: {
      type: String,
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", function (next) {
  if (this.isNew) {
    // Si c'est un nouvel utilisateur, valider les champs obligatoires
    if (!this.birthDay || !this.birthMonth || !this.birthYear) {
      return next(new Error("All required fields must be provided"));
    }
  }
  next();
});
const User = mongoose.model("User", userSchema);
export default User;
