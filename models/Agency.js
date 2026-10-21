import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "agencies";

export async function createAgency(data) {
  const collection = await getCollection(COLLECTION);
  const doc = {
    ...data,
    rating: 0,
    reviewsCount: 0,
    propertiesCount: 0,
    agentsCount: 0,
    isVerified: false,
    isFeatured: false,
    socialLinks: {},
    workingHours: { start: "09:00", end: "18:00" },
    specialties: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findAgencyById(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function findAgencyBySlug(slug) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ slug });
}

export async function findAgencies(filters = {}, options = {}) {
  const collection = await getCollection(COLLECTION);
  
  const {
    page = 1,
    limit = 12,
    sort = { rating: -1 },
  } = options;

  const query = collection.find(filters).sort(sort);
  
  const total = await collection.countDocuments(filters);
  const agencies = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    agencies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateAgency(id, data) {
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
  createAgency,
  findAgencyById,
  findAgencyBySlug,
  findAgencies,
  updateAgency,
};