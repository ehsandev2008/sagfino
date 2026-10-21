let _clientPromise = null;
let _db = null;

function getMongoClient() {
  if (typeof window !== "undefined") {
    throw new Error("MongoDB client can only be used on the server");
  }
  
  if (!_clientPromise) {
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGODB_URI;
    const options = {
      maxPoolSize: 10,
      minPoolSize: 0,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    if (!uri) {
      throw new Error("Please add MONGODB_URI to .env.local");
    }

    const client = new MongoClient(uri, options);
    _clientPromise = client.connect();
  }
  
  return _clientPromise;
}

export async function getDatabase() {
  const client = await getMongoClient();
  if (!_db) {
    _db = client.db("sagfino");
  }
  return _db;
}

export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export default getMongoClient;