import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017/mentoria0";

export const mongoClient = new MongoClient(uri);
