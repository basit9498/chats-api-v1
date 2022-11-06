const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, require: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

userModel.methods.passwordCompare = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userModel);

module.exports = User;
