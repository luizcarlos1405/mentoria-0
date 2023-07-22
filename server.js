const fs = require("fs");

var express = require("express");
var app = express();

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

app.get("/recurso", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end('<h1 style="color: red">Hola Mundo</h1>');
});

app.post("/new-message", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });

  res.end(`<p>${req.body.message}</p>`);
  return;
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
