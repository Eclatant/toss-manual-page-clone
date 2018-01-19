const mongoose = require("mongoose");

const { dbUri } = require("./index");

module.exports = () => {
  mongoose.Promise = global.Promise;

  const db = mongoose.connection;
  db.on(`error`, console.error);
  db.once(`open`, () => {
    console.log("MongoDB connect");
  });

  const connect = mongoose.connect(dbUri);
};
