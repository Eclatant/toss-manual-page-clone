const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ contents: "" });
});

module.exports = router;
