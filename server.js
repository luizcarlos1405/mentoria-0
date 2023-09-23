import mongoose from "mongoose";
import { messagesCollection } from "./mongo.js"; //perguntar do porque das chaves para o luiz
import express from "express";
import fs from "fs";

// SETUP SERVER
const app = express();

app.use(express.static("."));
app.use(express.urlencoded({ extended: true }));

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  fs.readFile("index.html", "utf8", (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  });
});

app.get("/messages", async function (req, res) {
  res.set({ "Content-Type": "text/html" });

  //bring some info from mongo
  const messages = await messagesCollection
    .find({
      // user: "Luiz",
    })
    .exec();

  const messagesHtml = messages
    .map((message) => `<p>${message.user}: ${message.msg}</p>`)
    .join("");
  res.end(messagesHtml);
});

app.post("/new-message", function (req, res) {
  //Saving on mongo
  const user = req.body.userName; // the const name has to equal to the Schema
  const msg = req.body.content; // the const name has to equal to the Schema
  messagesCollection.insertMany([{ user, msg }]);
  res.sendStatus(200);
});

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
