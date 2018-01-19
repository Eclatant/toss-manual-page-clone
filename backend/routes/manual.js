const express = require("express");

const Manual = require("../models/manual.js");

const router = express.Router();

router.get("/", (req, res) => {
  Manual.find({}, (error, manuals) => res.json(error ? error : { manuals }));
});

router.post("/", ({ body }, res) => {
  console.log(JSON.stringify(body, null, 2));
  ({ title, content } = body);
  const manual = Manual({ title, content });
  manual.save(error => res.json(error ? error : { complete: true }));
});

module.exports = router;
