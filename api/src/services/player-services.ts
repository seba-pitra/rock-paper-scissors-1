import RoomServices from "./rooms-services";
import { usersCollection, roomsCollection } from "../entities";
import { rtdb } from "../db/db";
import { IParamsUpdatePlayer, IPlayerData } from "../interfaces/player-interfaces";
import { IParamsChoosePlay } from "../interfaces/game-interfaces";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async searchUserByName(name: string): Promise<boolean> {
    const userFound = await PlayerServices.usersCollection
      .where("name", "==", name)
      .get();

    if (!userFound.empty) throw new Error("Player already exists with this name");

    return userFound.empty;
  }

  static async searchUserById(id: string): Promise<IPlayerData> {
    const userDocFound = await usersCollection.doc(id).get();

    if (!userDocFound.exists) throw new Error("User does not exists");

    const playerValues: IPlayerData = userDocFound.data();

    return playerValues;
  }

  static async addNewPlayer(name: string): Promise<IPlayerData> {
    await PlayerServices.searchUserByName(name);

    const newPlayer: FirebaseFirestore.DocumentData = await PlayerServices.usersCollection.add({
      name,
      online: false,
      start: false,
      choise: "",
      history: "",
    });

    await newPlayer.update({ id: newPlayer.id });

    const playerDoc: FirebaseFirestore.DocumentData = await newPlayer.get();
    const playerValues: IPlayerData = playerDoc.data();

    return playerValues;
  }

  static async addPlayerTwoAtRoom(name: string, roomId: string): Promise<any> {
    try {
      const roomRtdbRef = await RoomServices.getRtdbRoomReference(roomId);
      const playerTwo: IPlayerData = await PlayerServices.addNewPlayer(name);

      await roomRtdbRef.update({ playerTwo: playerTwo });

      const rtdbRoomDoc: any = await roomRtdbRef.get();
      const rtdbRoomData: any = await rtdbRoomDoc.val();

      return rtdbRoomData;
    } catch (err) {
      throw new Error("Failed to add new player at room. Try again later");
    }
  }

  static async getPlayerReference(rtdbRoomId: string, isPlayerOne: boolean): Promise<any> {
    if (isPlayerOne) return rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");

    return rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
  }

  static async getPlayerValues(rtdbRoomId: string, isPlayerOne: boolean) {
    const playerReference: any = await PlayerServices.getPlayerReference(rtdbRoomId, isPlayerOne);

    const playerDoc = await playerReference.get();
    const playerValues = await playerDoc.val();

    return playerValues;
  }

  static async updatePlayerStatusService({roomId, isPlayerOne, online, start }: IParamsUpdatePlayer): Promise<IPlayerData> {
    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);

    const playerReference: any = await PlayerServices.getPlayerReference(
      rtdbRoomId,
      isPlayerOne
    );

    await playerReference.update({
      online: Boolean(online),
      start: Boolean(start),
    });

    const playerValues: IPlayerData = await PlayerServices.getPlayerValues(
      rtdbRoomId,
      isPlayerOne
    );

    return playerValues;
  }


  // static async choosePlayService( params: IParamsChoosePlay): Promise<IPlayerData> {
  //   const { roomId } = params;
  //   const { isPlayerOne } = params;

  //   const rtdbRoomId = await RoomServices.getRtdbRoomId(roomId);
  //   const playerRef = await PlayerServices.getPlayerReference(
  //     rtdbRoomId,
  //     isPlayerOne
  //   );

  //   await playerRef.update({ choise: params.choise });

  //   const newPlayerValues: IPlayerData = await PlayerServices.getPlayerReferenceValues(rtdbRoomId, isPlayerOne);

  //   return newPlayerValues;
  // }

  // static async updatePlayerHistoryService( params: IParamsChoosePlay ): Promise<void> {
  //   const rtdbRoomId = await RoomServices.getRtdbRoomId(params.roomId);

  //   const roomRef = await PlayerServices.getPlayerReference(rtdbRoomId, params.isPlayerOne);

  //   await roomRef.update({ history: params.victories });
  // }

  // static async cleanPlayerChoiseService(params: IParamsChoosePlay): Promise<void> {
  //   const { roomId } = params;
  //   const { isPlayerOne } = params;
  //   const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);


  //   const playerReference: any = await PlayerServices.getPlayerReference(rtdbRoomId, isPlayerOne);

  //   await playerReference.update({ choise: "" });

  //   const newPlayerValues = await PlayerServices.getPlayerReferenceValues(rtdbRoomId, isPlayerOne);

  //   return newPlayerValues;
  // }
}
