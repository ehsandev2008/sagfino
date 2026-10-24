import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "@/lib/mongodb";

const COLLECTION = "inquiries";

export async function createInquiry(data) {
  const collection = await getCollection(COLLECTION);
  const doc = {
    ...data,
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findInquiryById(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function findInquiries(filters = {}, options = {}) {
  const collection = await getCollection(COLLECTION);
  
  const {
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
  } = options;

  const query = collection.find(filters).sort(sort);
  
  const total = await collection.countDocuments(filters);
  const inquiries = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    inquiries,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateInquiry(id, data) {
  const collection = await getCollection(COLLECTION);
  const updateDoc = {
    $set: {
      ...data,
      updatedAt: new Date(),
      respondedAt: data.response ? new Date() : null,
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
  createInquiry,
  findInquiryById,
  findInquiries,
  updateInquiry,
};