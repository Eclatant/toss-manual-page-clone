const express = require("express");

const { port } = require("./config");

const app = express();

app.listen(port, () => {
  console.log(`Hello, ${process.env.USER}! Server is running on ${port} port!`);
});
