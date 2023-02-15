import { usersCollection, roomsCollection } from "../entities";
import { rtdb } from "../db/db";
import RoomServices from "./rooms-services";
import { IMessage, IParamsUpdatePlayer } from "../interfaces/player-interfaces";

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
    if (!userDocFound.exists) throw new Error("User does not exists");
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

  static async getPlayerRef(
    rtdbRoomId: string,
    isPlayerOne: boolean
  ): Promise<any> {
    if (isPlayerOne) {
      return rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");
    } else {
      return rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
    }
  }

  static async updatePlayerStatusService(
    params: IParamsUpdatePlayer
  ): Promise<IMessage> {
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(params.roomId);

    const roomRef: any = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      params.isPlayerOne
    );

    await roomRef.update({
      online: Boolean(params.online),
      start: Boolean(params.start),
    });

    return { msg: "Player updated successfully" };
  }
}
