import mongoose from "mongoose";
import { messagesCollection, usersCollection } from "./mongo.js"; //perguntar do porque das chaves para o luiz
import express from "express";
import { sendHTML } from "./helpers.js";

// SETUP SERVER
const app = express();

app.use(express.static("."));
app.use(express.urlencoded({ extended: true }));

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  sendHTML(res, "index.html");
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

app.get("/login", async function (req, res) {
  sendHTML(res, "loginPage.html");
});

app.post("/login", async function (req, res) {
  const { handle, password } = req.body;

  const loggedUser = await usersCollection
    .findOne({
      handle,
      password,
    })
    .exec();

  // console.log(loggedUser);

  if (!loggedUser) {
    sendHTML(res, "loginPage.html", 401);
    return;
  }

  res.writeHead(303, { Location: "/" }).end();
});

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
