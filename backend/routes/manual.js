const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ contents: "" });
});

router.post("/", ({ body }, res) => {
  console.log(JSON.stringify(body, null, 2));
  res.json({ complete: true });
});

module.exports = router;
