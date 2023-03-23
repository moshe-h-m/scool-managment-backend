const express = require("express");
const Presence = require("../models/presenceModal");
const authStudent = require("../middleware/authClient");

const router = new express.Router();

router.post("/presence/create", authStudent, async (req, res) => {
  const newPersence = new Presence(req.body);
  const { userId } = req.body;
  console.log("userId", userId);
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  startOfDay.setDate(startOfDay.getDate() - 14);
  // console.log("startOfDay", startOfDay);
  try {
    Presence.find({ userId }, async function (err, results) {
      // console.log("results", results);
      const latesDates =
        results.filter(
          (p) =>
            p.isLate === true &&
            new Date(p.getIn).getTime() > new Date(startOfDay).getTime()
        ) || [];
      // console.log("latesDates", latesDates);
      // console.log("latesDates.lengthl", latesDates.length);
      newPersence.sumLatesInPastDays = latesDates.length;
      await newPersence.save();
    });

    res.send("report only get in");
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.post(
  "/presence/getPresenceDataParUser",
  authStudent,
  async (req, res) => {
    const { userId } = req.body;
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      startOfDay.setHours(startOfDay.getHours() + 2);
      //   console.log("userId", userId);
      Presence.find({ userId }, function (err, results) {
        if (err) throw err;
        // console.log("results", results);
        const filterResults = results.filter(
          (p) => new Date(p.getIn).getTime() > new Date(startOfDay).getTime()
        );
        if (filterResults.length > 0) {
          if (filterResults[0].getOut) {
            res.status(200).send("report get in and get out");
          } else {
            res.status(200).send("report only get in");
          }
        } else {
          res.status(200).send("did not report yet");
        }
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

router.post("/presence/updateGetOut", authStudent, async (req, res) => {
  const { userId, time } = req.body;
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    startOfDay.setHours(startOfDay.getHours() + 2);
    Presence.find({ userId }, async function (err, results) {
      if (err) throw err;
      const filterResults = results.filter(
        (p) => new Date(p.getIn).getTime() > new Date(startOfDay).getTime()
      );
      if (filterResults.length > 0) {
        if (!filterResults[0].getOut) {
          //   today.setHours(today.getHours() + 2);
          filterResults[0].getOut = time;
          await Presence.updateOne(
            { _id: filterResults[0]._id },
            filterResults[0]
          );
          res.status(200).send("update");
        } else {
          res.status(400).send("samthing went wrong");
        }
      } else {
        res.status(400).send("samthing went wrong");
      }
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

router.get("/presence/getAll", authStudent, async (req, res) => {
  try {
    const users = await Presence.find({});
    if (users.length === 0) {
      return res.status(200).send({
        status: 200,
        message: "no parsence",
      });
    }
    res.send({ parsences: users });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
