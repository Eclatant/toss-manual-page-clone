const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const { port } = require("./config");
const db = require("./config/db");
const manual = require("./routes/manual");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // https://stackoverflow.com/a/29177740
app.use(cors());
app.use("/manual", manual);

db().then(() =>
  app.listen(port, () => {
    console.log(
      `Hello, ${process.env.USER}! Server is running on ${port} port!`
    );
  })
);
