const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { port } = require("./config");
const db = require("./config/db");
const manual = require("./routes/manual");

const app = express();

db();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // parsing the URL-encoded data with the querystring library (when false), The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
app.use("/manual", manual);

app.listen(port, () => {
  console.log(`Hello, ${process.env.USER}! Server is running on ${port} port!`);
});
