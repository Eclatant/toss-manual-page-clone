const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { port } = require("./config");
const manual = require("./routes/manual");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/manual", manual);

app.listen(port, () => {
  console.log(`Hello, ${process.env.USER}! Server is running on ${port} port!`);
});
