import { mongoClient } from "./mongo.js";
import fs from "fs";
import express from "express";

// MONGO CONNECTION
const db = mongoClient.db("mentoria0");
const Messages = db.collection("messages");
// Messages.insertOne({ userName: "Luiz", content: "message" });

// RUN MIGRATIONS
function replaceKeysExcept(object) {
  // { a: 1, b: 2} => [["a", 1], ["b", 2]]
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
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

const migrations = {
  ["1"]: replaceKeysExcept,
};

const migrationStatus = JSON.parse(
  fs.readFileSync("migration-status.json", "utf8"),
);
const lastRunnedMigration = migrationStatus.lastRunnedMigration || 0;
const migrationFunction = migrations[lastRunnedMigration + 1];

if (migrationFunction) {
  fs.readFile("messages.json", "utf8", (err, messagedJson) => {
    const data = JSON.parse(messagedJson);
    const migratedData = data.map(migrationFunction);

    console.log({ messages: data, migratedMessages: migratedData });

    const newFileContent = JSON.stringify(migratedData);
    fs.writeFileSync("messages.json", newFileContent);
    fs.writeFileSync(
      "migration-status.json",
      JSON.stringify({ lastRunnedMigration: lastRunnedMigration + 1 }),
    );
  });
}

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

  const messages = await Messages.find({ userName: "Luiz" }).toArray();

  const messagesHtml = messages
    .map((message) => `<p>${message.userName}: ${message.content}</p>`)
    .join("");

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(messagesHtml);
});

app.post("/new-message", function (req, res) {
  fs.readFile("messages.json", "utf8", (err, messagesJson) => {
    const messages = JSON.parse(messagesJson);
    const newMessage = {
      userName: req.body.userName,
      content: req.body.content,
    };
    const newFileContent = JSON.stringify(messages);

    messages.push(newMessage);

    fs.writeFileSync("messages.json", newFileContent);
    res.sendStatus(200);
  });
});

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
