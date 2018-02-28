const fs = require("fs");
const mongoose = require("mongoose");
const readline = require("readline");

const { dbUri } = require("./index");
const Manual = require("../models/manual");

const readFile = file =>
  new Promise(resolve => {
    const lines = [];
    const rl = readline
      .createInterface({
        input: fs.createReadStream(`seed/${file}`)
      })
      .on("line", line => {
        lines.push(line.replace(/"/g, "").split(","));
      })
      .on("close", () => {
        resolve(lines.join("\n"));
      });
  });

const createSeeds = () =>
  new Promise(resolve => {
    fs.readdir(`seed`, (error, files) => {
      if (error) {
        return console.error(error);
      }

      Promise.all(
        files.map(f =>
          readFile(f).then(value => ({
            value,
            order: f.substring(0, f.indexOf("."))
          }))
        )
      ).then(resolve);
    });
  });

module.exports = () =>
  createSeeds().then(seeds => {
    const connection = mongoose.connection;

    mongoose.Promise = global.Promise;

    connection.on(`error`, console.error);
    connection.once(`open`, () => console.log("MongoDB connect"));

    mongoose
      .connect(dbUri)
      .then(
        async () =>
          await connection.db
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
      .then(
        () =>
          new Promise((resolve, reject) => {
            Manual.counterReset("id", error => {
              if (error) {
                console.error(`countRest Error ${error}`);
                reject();
              }
            });

            resolve();
          })
      )
      .then(async () => {
        await Manual.insertMany(seeds);
      })
      .catch(reason => console.error(`Promise Fail ${reason}`));
  });
