const express = require("express");
const User = require("../models/userModal");
const authManager = require("../middleware/authManager");
const authStudent = require("../middleware/authClient");

const router = new express.Router();

router.post("/users/create", authManager, async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});
router.post("/users/addBook", authStudent, async (req, res) => {
  const bookId = req.body.bookId;
  try {
    const user = await User.findOne({ _id: req.body.user._id });
    user.books.push(bookId);
    await User.updateOne({ _id: req.body.user._id }, user);
    res.send(user);
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});
router.put("/users/deleteBookFromUser", authStudent, async (req, res) => {
  const bookId = req.body.bookId;
  try {
    const user = await User.findOne({ _id: req.body.user._id });
    const newUser = user.books.filter((u) => u !== bookId);
    const indexOfBook = user.books.indexOf(bookId);
    user.books.splice(indexOfBook, 1);
    await User.updateOne({ _id: req.body.user._id }, user);
    res.send(user);
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.get("/users/getAll", authStudent, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(400).send({
        status: 400,
        message: "no users",
      });
    }
    res.send({ users: users });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/BookDetails/getById/:id", authStudent, async (req, res) => {
  try {
    const book = await User.findById(req.params.id);
    if (book.length === 0) {
      return res.status(400).send({
        status: 400,
        message: "no book",
      });
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/users/update", authStudent, async (req, res) => {
  try {
    await User.updateOne({ _id: req.body._id }, req.body);
    res.send(req.body);
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.put("/users/delete", authManager, async (req, res) => {
  const _id = req.body.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(400).send({
        status: 400,
        message: "wrong id",
      });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findUserbyEmailAndPassword(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.post("/users/logout", authStudent, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (tokenDoc) => tokenDoc.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users/new-token", authManager, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (tokenDoc) => tokenDoc.token !== req.token
    );
    const token = await req.user.generateAuthToken();
    res.send({ token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/logout-all", authManager, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
