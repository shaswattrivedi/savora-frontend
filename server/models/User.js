import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["Name is required"],
      trim: true,
      minlength: [2, "Name should be at least 2 characters"],
    },
    email: {
      type: String,
      required: ["Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Provide a valid email"],
    },
    password: {
      type: String,
      required: ["Password is required"],
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [280, "Bio cannot exceed 280 characters"],
      default: "",
    },
    avatarUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    recipesShared: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/**
 * Hash the password before saving whenever it is created or modified.
 */
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare a plaintext password with the hashed password stored on the user.
 */
userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Return a safe JSON representation of the user without sensitive fields.
 */
userSchema.methods.toSafeObject = function toSafeObject() {
  const { password, __v, ...safeUser } = this.toObject();
  return safeUser;
};

export const User = mongoose.model("User", userSchema);
