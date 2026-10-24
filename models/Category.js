import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "@/lib/mongodb";

const COLLECTION = "categories";

export async function createCategory(data) {
  const collection = await getCollection(COLLECTION);
  const doc = {
    ...data,
    order: data.order || 0,
    isActive: data.isActive !== false,
    seo: data.seo || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findCategoryById(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function findCategoryBySlug(slug) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ slug });
}

export async function findCategories(filters = {}) {
  const collection = await getCollection(COLLECTION);
  return collection.find(filters).sort({ order: 1, name: 1 }).toArray();
}

export async function updateCategory(id, data) {
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

export default {
  createCategory,
  findCategoryById,
  findCategoryBySlug,
  findCategories,
  updateCategory,
};