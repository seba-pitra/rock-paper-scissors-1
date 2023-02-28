import { firestore, rtdb } from "../db/db";
import { roomsCollection } from "../entities";
import { v4 as uuidv4 } from "uuid";
import { IPlayerData } from "../interfaces/player-interfaces";

export default class RoomServices {
  private static roomsCollection = roomsCollection;

  static async createRoomInRtdb(playerData: IPlayerData): Promise<string> {
    const rtdbRoomdId = uuidv4();
    const roomReference = rtdb.ref("rooms/" + rtdbRoomdId);
    await roomReference.set({ id: rtdbRoomdId, playerOne: playerData });

    return rtdbRoomdId;
  }

  static async createRoomInDatabase( playerData: IPlayerData ): Promise<FirebaseFirestore.DocumentData> {
    const idNewRealtimeRoom: string = await RoomServices.createRoomInRtdb(playerData);

    const firebaseRoomId: string = (10000 + Math.floor(Math.random() * 99999)).toString();

    await RoomServices.roomsCollection.doc(firebaseRoomId).set({
      id: firebaseRoomId,
      rtdbRoomId: idNewRealtimeRoom, //relations between firebase rooms and realtime rooms
      playerOne: playerData,
    });

    const newRoomDoc = await roomsCollection.doc(firebaseRoomId).get();
    const newRoomData = newRoomDoc.data();

    return newRoomData;
  }

  static async getFirebaseRoomData( roomId: string ): Promise<FirebaseFirestore.DocumentData> {
    const roomFirebaseData: FirebaseFirestore.DocumentData = await roomsCollection.doc(roomId).get();

    if (!roomFirebaseData.exists) throw new Error("Room not found with this ID");

    return roomFirebaseData;
  }

  static async getRtdbRoomId(roomId: string): Promise<string> {
    const roomFirebaseData: FirebaseFirestore.DocumentData = await RoomServices.getFirebaseRoomData(roomId);

    const rtdbRoomId = await roomFirebaseData.data().rtdbRoomId;

    if (!rtdbRoomId) throw new Error("Realtime room not found");

    return rtdbRoomId;
  }

  static async getRtdbRoomReference(roomId: string) {
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);
    
    return rtdb.ref("/rooms/" + rtdbRoomId);
  }
}
