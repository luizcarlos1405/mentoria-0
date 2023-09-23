import fsPromises from "fs/promises";
import fs from "fs";

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
      })
    );
  }
  
  const migrations = {
    ["1"]: replaceKeysExcept,
  };
  
  //Tratamento de migration-status caso não haja o arquivo
  const promise1 = fsPromises.readFile("migration-status.json", "utf8");
  
  const fileContent = await promise1.catch(async () => {
    await fsPromises.writeFile("migration-status.json", "{}");
    return fsPromises.readFile("migration-status.json", "utf8");
  });
  
  const migrationStatus = JSON.parse(fileContent);
  
  const lastRunnedMigration = migrationStatus.lastRunnedMigration || 0;
  const migrationFunction = migrations[lastRunnedMigration + 1];
  
  if (migrationFunction) {
    fs.readFile("messages.json", "utf8", (err, messagedJson) => {
      if (err) return;
      const data = JSON.parse(messagedJson);
      const migratedData = data.map(migrationFunction);
  
      console.log({ messages: data, migratedMessages: migratedData });
  
      const newFileContent = JSON.stringify(migratedData);
      fs.writeFileSync("messages.json", newFileContent);
      fs.writeFileSync(
        "migration-status.json",
        JSON.stringify({ lastRunnedMigration: lastRunnedMigration + 1 })
      );
    });
  }
  