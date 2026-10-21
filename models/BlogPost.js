import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "blog_posts";

export async function createBlogPost(data) {
  const collection = await getCollection(COLLECTION);
  const doc = {
    ...data,
    isPublished: data.isPublished || false,
    publishedAt: data.isPublished ? new Date() : null,
    viewsCount: 0,
    tags: data.tags || [],
    seo: data.seo || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findBlogPostById(id) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function findBlogPostBySlug(slug) {
  const collection = await getCollection(COLLECTION);
  return collection.findOne({ slug });
}

export async function findBlogPosts(filters = {}, options = {}) {
  const collection = await getCollection(COLLECTION);
  
  const {
    page = 1,
    limit = 10,
    sort = { publishedAt: -1 },
  } = options;

  const query = collection.find(filters).sort(sort);
  
  const total = await collection.countDocuments(filters);
  const posts = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateBlogPost(id, data) {
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

export default {
  createBlogPost,
  findBlogPostById,
  findBlogPostBySlug,
  findBlogPosts,
  updateBlogPost,
  incrementViews,
};