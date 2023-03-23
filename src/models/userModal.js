const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
      min: 12,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email");
      },
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    isLock: {
      type: Boolean,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    cycle: {
      type: String,
      trim: true,
    },
    imgSrc: {
      type: String,
      required: true,
    },
    familyStatus: {
      type: String,
      required: true,
      trim: true,
    },
    numKids: {
      type: Number,
      trim: true,
    },
    daysOff: {
      type: Number,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function name(next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

userSchema.statics.findUserbyEmailAndPassword = async (name, password) => {
  const user = await User.findOne({ name });
  if (!user) throw new Error("unable to login");
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) throw new Error("unable to login");
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "user",
});

// userSchema.pre("remove", async function (next) {
//   const user = this;
//   await Task.deleteMany({ user: user._id });
//   next();
// });

const User = mongoose.model("users", userSchema);

module.exports = User;
