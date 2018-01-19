const express = require("express");

const { port } = require("./config");
const manual = require("./routes/manual");

const app = express();

app.use("/manual", manual);

app.listen(port, () => {
  console.log(`Hello, ${process.env.USER}! Server is running on ${port} port!`);
});
