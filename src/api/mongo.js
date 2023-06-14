const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const connectDB = async () => {
  await client.connect();
};

export const insertDoc = async (dataBaseName, insertedData) => {
  const db = client.db();

  return db.collection(dataBaseName).insertOne(insertedData);
};

export const closeDB = () => {
  client.close();
};

export const getCollectionItem = async (dataBaseName, finder = {}) => {
  const db = client.db();

  return await db.collection(dataBaseName)
    .find(finder)
    .sort({ _id: -1 })
    .toArray();
};

export const updateDoc = async (dataBaseName, email, insertedData) => {
  const db = client.db();
  const result = await db.collection(dataBaseName).updateOne({ email: email }, { $set: { password: insertedData } });

  return result;
}