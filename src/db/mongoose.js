const mongoose = require("mongoose");

const connect_strnig = process.env.MONGOD_URL;
mongoose.set("strictQuery", true);
mongoose.connect(connect_strnig, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
