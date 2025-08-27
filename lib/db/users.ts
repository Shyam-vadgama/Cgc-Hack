import { getDatabase } from "../mongodb"
import type { User } from "../auth"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = "users"

export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
  const db = await getDatabase()
  const collection = db.collection<User>(COLLECTION_NAME)

  const now = new Date()
  const user: Omit<User, "_id"> = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.insertOne(user as User)

  return {
    _id: result.insertedId,
    ...user,
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  const collection = db.collection<User>(COLLECTION_NAME)

  return await collection.findOne({ email: email.toLowerCase() })
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDatabase()
  const collection = db.collection<User>(COLLECTION_NAME)

  try {
    return await collection.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    return null
  }
}

export async function updateUser(id: string, updates: Partial<Omit<User, "_id" | "createdAt">>): Promise<User | null> {
  const db = await getDatabase()
  const collection = db.collection<User>(COLLECTION_NAME)

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result || null
  } catch (error) {
    return null
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await getDatabase()
  const collection = db.collection<User>(COLLECTION_NAME)

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  } catch (error) {
    return false
  }
}
