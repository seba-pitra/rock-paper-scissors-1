import { usersCollection, roomsCollection } from "../entities";
import { rtdb } from "../db/db";
import RoomServices from "./rooms-services";
import {
  IParamsUpdatePlayer,
  IPlayerData,
} from "../interfaces/player-interfaces";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async searchUserByName(name: string): Promise<void> {
    const userFound = await PlayerServices.usersCollection
      .where("nombre", "==", name)
      .get();

    if (!userFound.empty) throw new Error("User already exists with this name");
  }

  static async searchUserById(id: string): Promise<boolean> {
    const userDocFound = await usersCollection.doc(id).get();
    if (!userDocFound.exists) throw new Error("User does not exists");
    return userDocFound.exists;
  }

  static async addnewUser(name: string): Promise<string> {
    //If player not exists with this name, this function will give up a error
    await PlayerServices.searchUserByName(name);

    const response = await PlayerServices.usersCollection.add({ name });
    return response.id;
  }

  static async addPlayerTwoAtRoom(roomId: string): Promise<string> {
    const roomRtdbRef = await RoomServices.getRtdbRoomReference(roomId);

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

  static async getPlayerReferenceValues(
    rtdbRoomId: string,
    isPlayerOne: boolean
  ) {
    const playerRef: any = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      isPlayerOne
    );

    const snapshotPlayerData = await playerRef.get();
    const playerValues = await snapshotPlayerData.val();

    return playerValues;
  }

  static async updatePlayerStatusService(
    params: IParamsUpdatePlayer
  ): Promise<IPlayerData> {
    const { isPlayerOne } = params;
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(params.roomId);

    const playerRef: any = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      params.isPlayerOne
    );

    await playerRef.update({
      online: Boolean(params.online),
      start: Boolean(params.start),
    });

    const playerValues: IPlayerData =
      await PlayerServices.getPlayerReferenceValues(rtdbRoomId, isPlayerOne);

    return playerValues;
  }
}
