import { firestore, rtdb } from "../db/db";
import { roomsCollection } from "../entities";
import { v4 as uuidv4 } from "uuid";
import { IPlayerData } from "../interfaces/player-interfaces";

export default class RoomServices {
  private static roomsCollection = roomsCollection;

  static async createRoomInRtdb(playerData: IPlayerData): Promise<string> {
    //Room will create at realtime database with player one
    const rtdbRoomdId = uuidv4();
    const roomRef = rtdb.ref("rooms/" + rtdbRoomdId);
    await roomRef.set({ id: rtdbRoomdId, playerOne: playerData });

    return rtdbRoomdId;
  }

  static async createRoomInDatabase(
    playerData: IPlayerData
  ): Promise<FirebaseFirestore.DocumentData> {
    const idRealtimeRoom = await RoomServices.createRoomInRtdb(playerData);
    const roomShorterId = (10000 + Math.floor(Math.random() * 9999)).toString();

    await RoomServices.roomsCollection.doc(roomShorterId).set({
      id: roomShorterId,
      rtdbRoomId: idRealtimeRoom, //relations between firebase rooms and realtime rooms
      playerOne: playerData,
    });

    const newRoomDoc = await roomsCollection.doc(roomShorterId).get();
    const newRoomData = newRoomDoc.data();

    return newRoomData;
  }

  static async getRoomData(
    roomId: string
  ): Promise<FirebaseFirestore.DocumentData> {
    const roomFound = await roomsCollection.doc(roomId).get();
    if (!roomFound.exists) throw new Error("Room not found with this ID");
    return roomFound;
  }

  static async getFirebaseRoomData(
    roomId: string
  ): Promise<FirebaseFirestore.DocumentData> {
    const roomFirebaseData: FirebaseFirestore.DocumentData =
      await roomsCollection.doc(roomId).get();
    return roomFirebaseData;
  }

  static async getRtdbRoomId(roomId: string): Promise<string> {
    const roomFirebaseData = await RoomServices.getFirebaseRoomData(roomId);

    const rtdbRoomId = await roomFirebaseData.data().rtdbRoomId;
    if (!rtdbRoomId) throw new Error("Realtime room not found");

    return rtdbRoomId;
  }

  static async getRtdbRoomReference(roomId: string) {
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);
    return rtdb.ref("/rooms/" + rtdbRoomId);
  }
}
