import fs from "fs";

export function sendHTML(res, filePath, status = 200) {
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(status, { "Content-Type": "text/html" });
    res.end(content);
  });
}
