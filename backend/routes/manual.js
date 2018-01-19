const express = require("express");

const Manual = require("../models/manual.js");

const router = express.Router();

router.get("/", (req, res) => {
  Manual.find({}, (error, manuals) => res.json(error ? error : { manuals }));
});

router.post("/", ({ body }, res) => {
  console.log(JSON.stringify(body, null, 2));
  ({ value } = body);
  const manual = Manual({ value });
  manual.save(error => res.json(error ? error : { complete: true }));
});

router.put("/:contentId", ({ body, params }, res) => {
  Manual.findOneAndUpdate(
    { id: params.contentId },
    { value: body.value },
    {},
    (error, manual) => {
      if (error) {
        console.error(`database failure ${error}`);
        return res.status(500).json({ complete: false });
      }

      if (!manual) {
        console.error(`manual not found`);
        return res.status(404).json({ complete: false });
      }

      manual.save(error => {
        if (error) {
          console.error(`Document Create Error ${error}`);
          res.status(416).json({ complete: false });
        } else {
          res.status(200).json({ complete: true });
        }
      });
    }
  );
});

module.exports = router;
