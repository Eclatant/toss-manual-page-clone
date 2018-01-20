const fs = require("fs");
const mongoose = require("mongoose");
const readline = require("readline");

const { dbUri } = require("./index");
const Manual = require("../models/manual");

let seed = null;

fs.readdir(`seed`, async (err, files) => {
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

  const promises = files.map(f => readFile(f));

  seed = await Promise.all(promises)
    .then(data => data.map(value => ({ value })))
    .catch(console.error);
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

        console.log(seed);
        for (s of seed) {
          Manual(s).save(error => {
            if (error) console.error(`Document Create Error ${error}`);
          });
        }
      });
    })
    .catch(reason => console.error(`Promise Fail ${reason}`));
};
