const fs = require("fs");
const messages = [];

const express = require("express");
const app = express();

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
  let messagesHtml = messages.map((message) => `<p>${message}</p>`).join("");
  res.send(messagesHtml);
});

app.post("/new-message", function (req, res) {
  messages.push(req.body.message);
  res.sendStatus(200);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
