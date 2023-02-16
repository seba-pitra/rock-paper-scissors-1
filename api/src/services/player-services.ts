import { usersCollection, roomsCollection } from "../entities";
import { rtdb } from "../db/db";
import RoomServices from "./rooms-services";
import {
  IParamsUpdatePlayer,
  IPlayerData,
} from "../interfaces/player-interfaces";
import { IParamsChoosePlay } from "../interfaces/game-interfaces";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async searchUserByName(name: string): Promise<boolean> {
    const userFound = await PlayerServices.usersCollection
      .where("nombre", "==", name)
      .get();

    if (!userFound.empty) throw new Error("User already exists with this name");

    return userFound.empty;
  }

  static async searchUserById(id: string): Promise<IPlayerData> {
    const userDocFound = await usersCollection.doc(id).get();
    if (!userDocFound.exists) throw new Error("User does not exists");

    const playerValues = userDocFound.data();

    return playerValues;
  }

  static async addNewPlayer(name: string): Promise<IPlayerData> {
    //If player not exists with this name, this function will give up a error
    await PlayerServices.searchUserByName(name);

    const response = await PlayerServices.usersCollection.add({
      name,
      online: false,
      start: false,
      choise: "",
      history: "",
    });

    await response.update({ id: response.id });

    const playerValues = (await response.get()).data();

    return playerValues;
  }

  static async addPlayerTwoAtRoom(name: string, roomId: string): Promise<any> {
    const roomRtdbRef = await RoomServices.getRtdbRoomReference(roomId);

    const playerTwo: IPlayerData = await PlayerServices.addNewPlayer(name);

    try {
      await roomRtdbRef.update({ playerTwo: playerTwo });

      const rtdbRoomDoc: any = await roomRtdbRef.get();
      const rtdbRoomData: any = await rtdbRoomDoc.val();

      return rtdbRoomData;
    } catch (err) {
      throw new Error("Failed to add new player at room. Try again later");
    }
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

  //

  static async choosePlayService(params: IParamsChoosePlay): Promise<void> {
    const rtdbRoomId = await RoomServices.getRtdbRoomId(params.roomId);

    const roomRef = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      params.isPlayerOne
    );

    await roomRef.update({ choise: params.choise });
  }

  static async updatePlayerHistoryService(
    params: IParamsChoosePlay
  ): Promise<void> {
    const rtdbRoomId = await RoomServices.getRtdbRoomId(params.roomId);

    const roomRef = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      params.isPlayerOne
    );

    await roomRef.update({ history: params.victories });
  }

  static async cleanPlayerChoiseService(
    params: IParamsChoosePlay
  ): Promise<void> {
    const { roomId } = params;
    const { isPlayerOne } = params;
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);
    const playerReference: any = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      isPlayerOne
    );

    await playerReference.update({ choise: "" });

    const newPlayerValues = await PlayerServices.getPlayerReferenceValues(
      rtdbRoomId,
      isPlayerOne
    );

    return newPlayerValues;
  }
}
