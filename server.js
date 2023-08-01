const fs = require("fs");
const messages = [];
let bmessages = fs.readFileSync("b-messages.json").toString();
let bmessages2 = "";

bmessages = JSON.parse(bmessages); //bmessages[]

const express = require("express");
const app = express();

app.use(express.static("."))
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

app.get("/messages", function (req, res) {
  res.set({ "Content-Type": "text/html" });
  let messagesHtml = bmessages.map((message) => `<p>${message}</p>`).join("");
  res.send(messagesHtml);
});

app.post("/new-message", function (req, res) {
  messages.push(req.body.message);
  bmessages.push(req.body.message);
  bmessages2 = bmessages;
  bmessages2 = JSON.stringify(bmessages2);
  fs.writeFileSync("b-messages.json",bmessages2);
  console.log(bmessages);
  res.sendStatus(200);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
