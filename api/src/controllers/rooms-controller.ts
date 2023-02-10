import { Request, Response } from "express";
import { firestore, rtdb } from "../db/db";
import { v4 as uuidv4 } from "uuid";

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

class DatabaseRooms {}

export default class Rooms {
  private async createRoomInRtdbAndFirebase(userId) {
    //Room will create at realtime database with player one
    const roomRef = rtdb.ref("rooms/" + uuidv4());
    await roomRef.set({ playerOne: userId });

    const roomLongerId = roomRef.key; // Get rtdb room id
    const roomShorterId = (10000 + Math.floor(Math.random() * 9999)).toString();

    roomsCollection.doc(roomShorterId).set({
      rtdbRoom: roomLongerId, //relations between firebase rooms and realtime rooms
    });
  }

  async createNewRoomWithPlayerOne(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    try {
      const userDocFound = await usersCollection.doc(userId.toString()).get();
      if (!userDocFound.exists) throw new Error("User does not exists");

      const roomShorterId = this.createRoomInRtdbAndFirebase(userId);

      const response = { msg: "Room created successfully", id: roomShorterId };
      res.status(201).json(response);
    } catch (err) {
      res.json(404).json({ msg: err.message });
    }
  }
}
