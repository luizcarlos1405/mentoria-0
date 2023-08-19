const fs = require("fs");
let messages = [];
const fileContent = fs.readFile("b-messages.json", (err, data) => {
  if (err) {
    fs.writeFileSync("b-messages.json", "[]");
    return;
  }
  messages = JSON.parse(data);

  function replaceKeysExcept(object) {
    console.log(object);
    // { a: 1, b: 2} => [["a", 1], ["b", 2]]
    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => {
        console.log(key);
        console.log(value);
        // const [key, value] = entry;
        // const key = entry[0];
        // const value = entry[1];
  
        if (key === "name") {
          return ["userName", value];
        }
  
        if (key === "message") {
          return ["content", value];
        }
  
        return [key, value];
      }),
    );
  }
  
  console.log(messages.map(replaceKeysExcept));
});

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
    .map((message) => `<p>${message.userName}: ${message.content}</p>`)
    .join("");
  res.send(messagesHtml);
});

app.post("/new-message", function (req, res) {
  messages.push({ userName: req.body.userName, content: req.body.content });
  const newFileContent = JSON.stringify(messages);
  fs.writeFileSync("b-messages.json", newFileContent);
  res.sendStatus(200);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
