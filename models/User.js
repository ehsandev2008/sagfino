import { getCollection, getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "users";

export async function createUser(data) {
  const collection = await getCollection(COLLECTION);
  const doc = {
    ...data,
    role: data.role || "user",
    saved: [],
    isVerified: false,
    preferences: {
      notifications: true,
      newsletter: false,
      language: "fa",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findUserByPhone(phone) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ phone });
}

export async function findUserById(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateUser(id, data) {
  const collection = await getCollection(COLLECTION);
  const updateDoc = {
    $set: {
      ...data,
      updatedAt: new Date(),
    },
  };
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    updateDoc,
    { returnDocument: "after" }
  );
  return result;
}

export async function addSavedProperty(userId, propertyId) {
  const collection = await getCollection(COLLECTION);
  return collection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $addToSet: { saved: new ObjectId(propertyId) }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" }
  );
}

export async function removeSavedProperty(userId, propertyId) {
  const collection = await getCollection(COLLECTION);
  return collection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull: { saved: new ObjectId(propertyId) }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" }
  );
}

export default {
  createUser,
  findUserByPhone,
  findUserById,
  updateUser,
  addSavedProperty,
  removeSavedProperty,
};