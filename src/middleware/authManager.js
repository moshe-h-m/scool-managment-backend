const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

const authManager = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    if (data.role != "ROLE_INSTRUCTOR") {
      return res.status(400).send({
        status: 400,
        message: "you get no premition to this action",
      });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "not authenticate",
    });
  }
};

module.exports = authManager;
