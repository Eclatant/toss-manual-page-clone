const express = require("express");

const Manual = require("../models/manual.js");

const router = express.Router();

router.get("/", (req, res) =>
  Manual.find({}, (error, manuals) => res.json(error ? error : { manuals }))
);

router.post("/", ({ body, body: { value, order } }, res) => {
  console.log(JSON.stringify(body, null, 2));

  const m = Manual({ value, order });

  m.save(error => {
    if (error) {
      console.error(`Document Create Error ${error}`);
      return res.status(416).json({ complete: false });
    }

    return res.status(200).json({ complete: true });
  });
});

router.put("/:order", ({ body: { value }, params: { order } }, res) => {
  Manual.findOneAndUpdate({ order }, { value }, (error, manual) => {
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
  });
});

router.delete("/:order", ({ params: { order } }, res) => {
  Manual.findOneAndRemove({ order }, (error, manual) => {
    if (error) {
      console.error(`Manuals Remove Error ${error}`);
      return res.status(500).json({ complete: false });
    }

    if (!manual) {
      console.error(`manual not found`);
      return res.status(404).json({ complete: false });
    }

    manual.remove(error => {
      if (error) {
        console.error(`Document Create Error ${error}`);
        res.status(416).json({ complete: false });
      } else {
        res.status(200).json({ complete: true });
      }
    });
  });
});

module.exports = router;
