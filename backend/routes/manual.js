const express = require("express");

const Manual = require("../models/manual.js");

const router = express.Router();

router.get("/", (req, res) => {
  Manual.find({}, (error, manuals) => res.json(error ? error : { manuals }));
});

router.post("/", ({ body }, res) => {
  console.log(JSON.stringify(body, null, 2));
  res.json({ complete: true });
});

module.exports = router;
