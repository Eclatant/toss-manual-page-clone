const mongoose = require("mongoose");

const { dbUri } = require("./index");
const Manual = require("../models/manual");
const manuals = require("../data/seed");

module.exports = () => {
  const connection = mongoose.connection;

  mongoose.Promise = global.Promise;

  connection.on(`error`, console.error);
  connection.once(`open`, () => {
    console.log("MongoDB connect");
  });

  mongoose
    .connect(dbUri)
    .then(_ =>
      connection.db.dropCollection("manuals", error => {
        if (error) console.error(`dropCollection error ${error}`);
      })
    )
    .then(_ => {
      Manual.counterReset("id", error => {
        if (error) console.error(`countRest Error ${error}`);

        for (m of manuals)
          Manual(m).save(error => {
            if (error) console.error(`Document Create Error ${error}`);
          });
      });
    })
    .catch(reason => console.error(reason));
};
