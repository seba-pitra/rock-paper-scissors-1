import { usersCollection, roomsCollection } from "../collections";
import { rtdb } from "../db/db";
import RoomServices from "./rooms-services";
import { IParamsUpdatePlayer } from "../interfaces/player-interfaces";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async searchUserByName(name: string): Promise<string> {
    const userFound = await PlayerServices.usersCollection
      .where("nombre", "==", name)
      .get();

    if (!userFound.empty) throw new Error("user already exists with this name");

    return "Player one created successfully";
  }

  static async searchUserById(id: string): Promise<boolean> {
    const userDocFound = await usersCollection.doc(id).get();
    return userDocFound.exists;
  }

  static async addnewUser(name: string): Promise<string> {
    const response = await PlayerServices.usersCollection.add({ name });
    return response.id;
  }

  static async getRoomData(
    roomId: string
  ): Promise<FirebaseFirestore.DocumentData> {
    const roomFound = await roomsCollection.doc(roomId).get();
    if (!roomFound.exists) throw new Error("Room not found with this ID");
    return roomFound;
  }

  static async addPlayerTwoAtRoom(roomId: string): Promise<string> {
    const roomFound: FirebaseFirestore.DocumentData =
      await PlayerServices.getRoomData(roomId);
    const rtdbRoomId: string = roomFound.data().rtdbRoom; //rtdbRoom id

    const roomRtdbRef = rtdb.ref("/rooms/" + rtdbRoomId);
    return roomRtdbRef
      .update({ playerTwo: "new player" })
      .then(() => "New player added at room successfully")
      .catch(() => {
        throw new Error("Failed to add new player at room. Try again later");
      });
  }

  static async updatePlayerStatusService(
    params: IParamsUpdatePlayer
  ): Promise<string> {
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(params.roomId);

    let roomRef: any;

    if (params.isPlayerOne) {
      roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");
    } else {
      roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
    }

    await roomRef.update({
      online: Boolean(params.online),
      start: Boolean(params.start),
      name: params.name,
    });

    return "Player updated successfully";
  }
}
