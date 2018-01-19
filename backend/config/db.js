const mongoose = require("mongoose");

const { dbUri } = require("./index");
const Manual = require("../models/manual");
const manuals = require("../data/seed");

module.exports = () => {
  mongoose.Promise = global.Promise;

  const connection = mongoose.connection;
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
      for (m of manuals)
        Manual(m).save(error => {
          if (error) console.error(`Document Create Error ${error}`);
        });
    })
    .catch(reason => console.error(reason));
};
