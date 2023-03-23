const User = require("../models/userModal");
const express = require("express");

const router = new express.Router();

router.post("/login", async (req, res) => {
  var datetime = new Date();
  datetime.setHours(datetime.getHours() + 6);
  try {
    const user = await User.findUserbyEmailAndPassword(
      req.body.name,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token, token_expiry: datetime });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

module.exports = router;
