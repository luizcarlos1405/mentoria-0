const fs = require("fs");
let messages = [];
const fileContent = fs.readFile("b-messages.json", (err, data) => {
  if (err) {
    fs.writeFileSync("b-messages.json", "[]");
    return;
  }
  messages = JSON.parse(data);
});
// const fileContent = fs.readFileSync("b-messages.json").toString();

const express = require("express");
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

app.get("/messages", function (req, res) {
  res.set({ "Content-Type": "text/html" });
  const messagesHtml = messages
    .map((message) => `<p>${message.name}: ${message.message}</p>`)
    .join("");
  res.send(messagesHtml);
});

app.post("/new-message", function (req, res) {
  messages.push({ name: req.body.name, message: req.body.message });
  const newFileContent = JSON.stringify(messages);
  fs.writeFileSync("b-messages.json", newFileContent);
  res.sendStatus(200);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
