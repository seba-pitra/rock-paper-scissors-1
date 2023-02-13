import { firestore, rtdb } from "../db/db";
import { roomsCollection } from "../collections";
import { v4 as uuidv4 } from "uuid";

export default class RoomServices {
  private static roomsCollection = roomsCollection;

  static async createRoomInRtdb(userId: string): Promise<string> {
    //Room will create at realtime database with player one
    const roomRef = rtdb.ref("rooms/" + uuidv4());
    await roomRef.set({ playerOne: userId });

    const idRealtimeRoom = roomRef.key; // Get rtdb room id
    return idRealtimeRoom;
  }

  static async createRoomInDatabase(userId: string): Promise<string> {
    const idRealtimeRoom = await this.createRoomInRtdb(userId);
    const roomShorterId = (10000 + Math.floor(Math.random() * 9999)).toString();

    await RoomServices.roomsCollection.doc(roomShorterId).set({
      rtdbRoom: idRealtimeRoom, //relations between firebase rooms and realtime rooms
    });

    return roomShorterId;
  }

  static async getFirebaseRoomData(
    roomId: string
  ): Promise<FirebaseFirestore.DocumentData> {
    const roomFirebaseData = await roomsCollection.doc(roomId).get();
    return roomFirebaseData;
  }

  static async getRtdbRoomId(roomId: string): Promise<string> {
    const roomFirebaseData = await this.getFirebaseRoomData(roomId);

    const rtdbRoomId = await roomFirebaseData.data().rtdbRoom;
    if (!rtdbRoomId) throw new Error("Realtime room not found");

    return rtdbRoomId;
  }
}
