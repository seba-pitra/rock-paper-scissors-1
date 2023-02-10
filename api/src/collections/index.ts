import { firestore } from "../db/db";

export const usersCollection = firestore.collection("users");
export const roomsCollection = firestore.collection("rooms");
