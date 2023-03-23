const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const port = process.env.PORT;

const usersRouter = require("./router/usersRouter");

const authRouter = require("./router/authRouter");
const presenceRouter = require("./router/presenceRouter");

const app = express();

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(usersRouter);
app.use(presenceRouter);

app.listen(port, () => {
  console.log("Server connectes, port:", port);
});
