import { getCollection, getDatabase } from "@/lib/mongodb";
import { ObjectId } from "@/lib/mongodb";

const COLLECTION = "properties";

const PROPERTY_TYPES = ["apartment", "villa", "commercial", "land", "office", "store"];
const DEAL_TYPES = ["rent", "buy", "mortgage"];
const STATUSES = ["draft", "pending_review", "active", "sold", "rented", "expired", "rejected"];

export async function createProperty(data) {
  const collection = await getCollection(COLLECTION);
  const doc = {
    ...data,
    type: data.type || "rent",
    propertyType: data.propertyType || "apartment",
    status: data.status || "draft",
    isFeatured: false,
    isVerified: false,
    viewsCount: 0,
    favoritesCount: 0,
    inquiriesCount: 0,
    images: data.images || [],
    features: data.features || [],
    nearbyPlaces: data.nearbyPlaces || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findPropertyById(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function findProperties(filters = {}, options = {}) {
  const collection = await getCollection(COLLECTION);
  
  const {
    page = 1,
    limit = 12,
    sort = { createdAt: -1 },
  } = options;

  const query = collection.find(filters).sort(sort);
  
  const total = await collection.countDocuments(filters);
  const properties = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function findPropertiesByIds(ids) {
  const collection = await getCollection(COLLECTION);
  return collection.find({ _id: { $in: ids.map((id) => new ObjectId(id)) } }).toArray();
}

export async function updateProperty(id, data) {
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

export async function incrementViews(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { viewsCount: 1 } },
    { returnDocument: "after" }
  );
}

export async function incrementFavorites(id, delta = 1) {
  const collection = await getCollection(COLLECTION);
  return collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { favoritesCount: delta } },
    { returnDocument: "after" }
  );
}

export async function incrementInquiries(id, delta = 1) {
  const collection = await getCollection(COLLECTION);
  return collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { inquiriesCount: delta } },
    { returnDocument: "after" }
  );
}

export default {
  createProperty,
  findPropertyById,
  findProperties,
  findPropertiesByIds,
  updateProperty,
  incrementViews,
  incrementFavorites,
  incrementInquiries,
};