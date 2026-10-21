const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sagfino";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoose = await import("mongoose");
    cached.promise = mongoose.default
      .connect(MONGODB_URI, { dbName: "sagfino" })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
export { connectDB };