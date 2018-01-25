const fs = require("fs");
const mongoose = require("mongoose");
const readline = require("readline");

const { dbUri } = require("./index");
const Manual = require("../models/manual");

const seed = [];

fs.readdir(`seed`, (error, files) => {
  if (error) return console.error(error);

  const readFile = file =>
    new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: fs.createReadStream(`seed/${file}`)
      });
      let lines = [];

      rl
        .on("line", line => {
          lines.push(line.replace(/"/g, "").split(","));
        })
        .on("close", () => {
          resolve(lines.join("\n"));
        });
    });

  files.forEach((f, i) =>
    readFile(f)
      .then(value => seed.push({ value, order: i + 1 }))
      .catch(console.error)
  );
});

module.exports = () => {
  const connection = mongoose.connection;

  mongoose.Promise = global.Promise;

  connection.on(`error`, console.error);
  connection.once(`open`, () => console.log("MongoDB connect"));

  mongoose
    .connect(dbUri)
    .then(_ =>
      connection.db
        .listCollections({ name: "manuals" })
        .next((error, collectionInfo) => {
          if (error) console.error(`listCollections next error ${error}`);

          if (collectionInfo) {
            connection.db.dropCollection("manuals", error => {
              if (error) console.error(`dropCollection error ${error}`);
            });
          }
        })
    )
    .then(_ => {
      Manual.counterReset("id", error => {
        if (error) console.error(`countRest Error ${error}`);

        for (s of seed) {
          Manual(s).save(error => {
            if (error) console.error(`Document Create Error ${error}`);
          });
        }
      });
    })
    .catch(reason => console.error(`Promise Fail ${reason}`));
};
