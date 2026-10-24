import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "@/lib/mongodb";

const COLLECTION = "favorites";

export async function toggleFavorite(userId, propertyId) {
  const collection = await getCollection(COLLECTION);
  
  const existing = await collection.findOne({
    user: new ObjectId(userId),
    property: new ObjectId(propertyId),
  });

  if (existing) {
    await collection.deleteOne({ _id: existing._id });
    return { isFavorite: false };
  }

  await collection.insertOne({
    user: new ObjectId(userId),
    property: new ObjectId(propertyId),
    createdAt: new Date(),
  });
  return { isFavorite: true };
}

export async function getUserFavorites(userId, options = {}) {
  const collection = await getCollection(COLLECTION);
  
  const {
    page = 1,
    limit = 12,
    sort = { createdAt: -1 },
  } = options;

  const pipeline = [
    { $match: { user: new ObjectId(userId) } },
    { $sort: sort },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: "properties",
        localField: "property",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    {
      $lookup: {
        from: "users",
        localField: "property.owner",
        foreignField: "_id",
        as: "property.owner",
      },
    },
    { $unwind: { path: "$property.owner", preserveNullAndEmptyArrays: true } },
  ];

  const favorites = await collection.aggregate(pipeline).toArray();
  const total = await collection.countDocuments({ user: new ObjectId(userId) });

  return {
    favorites: favorites.map((f) => f.property),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function isFavorite(userId, propertyId) {
  const collection = await getCollection(COLLECTION);
  const existing = await collection.findOne({
    user: new ObjectId(userId),
    property: new ObjectId(propertyId),
  });
  return !!existing;
}

export default {
  toggleFavorite,
  getUserFavorites,
  isFavorite,
};