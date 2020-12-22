require("dotenv").config();
const apiKey = process.env.API_KEY;
console.log(apiKey);

const base = require("airtable").base("appis5HgmqJgnDS7r");

const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "."));

let records;

app.get("/", (req, res) => {
  if (records) {
    console.log("cached");
    res.render("page", {
      records,
    });
  } else {
    (async () => {
      records = await base("Business Hours")
        .select({
          view: "Grid view",
        })
        .firstPage();
      res.render("page", {
        records,
      });
      // for (const record of records) {
      //   //console.log(record.fields)
      //   console.log(record.get('Day'), record.get('Hours'))
      // }
      setTimeout(() => {
        records = null;
      }, 10 * 1000);
    })();
  }
});

app.listen(3000, () => console.log("Server ready"));
