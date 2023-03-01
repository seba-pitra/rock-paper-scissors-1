import RoomServices        from "./rooms-services";
import { usersCollection } from "../entities";
import { rtdb }            from "../db/db";
import { IParamsUpdatePlayer, IPlayerData } from "../interfaces/player-interfaces";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async createNewPlayer(name: string): Promise<IPlayerData> {
    await PlayerServices.getPlayerByName(name);

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

  static async updatePlayerData(
    { 
      roomId, choise, losses, victories, isPlayerOne, online, start
    }: IParamsUpdatePlayer ): Promise<IPlayerData> {

    const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);
    const playerReference    = await PlayerServices.getPlayerReference(rtdbRoomId, isPlayerOne);
    const playerProperties: IPlayerData = await PlayerServices.getPlayerValues(rtdbRoomId, isPlayerOne);

    if(losses)               await playerReference.update({ losses: losses });
    if(victories)            await playerReference.update({ victories: victories });
    if(start !== undefined)  await playerReference.update({ start: start });
    if(online !== undefined) await playerReference.update({ online: online });

    
    if(playerProperties.online && playerProperties.start) {
      !choise ? "clean" : await playerReference.update({ choise: choise })
    }
    
    const newValues: IPlayerData = await PlayerServices.getPlayerValues(rtdbRoomId, isPlayerOne);

    return newValues;
  }

  static async getPlayerByName(name: string): Promise<boolean> {
    const userFound = await PlayerServices.usersCollection
      .where("name", "==", name)
      .get();

    if (!userFound.empty) throw new Error("Player already exists with this name");

    return userFound.empty;
  }

  static async getPlayerById(id: string): Promise<IPlayerData> {
    const userDocFound = await usersCollection.doc(id).get();

    if (!userDocFound.exists) throw new Error("User does not exists");

    const playerValues: IPlayerData = userDocFound.data();

    return playerValues;
  }

  static async getPlayerReference(rtdbRoomId: string, isPlayerOne: boolean): Promise<any> {
    if (isPlayerOne) return rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");

    return rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
  }

  static async getPlayerValues(rtdbRoomId: string, isPlayerOne: boolean): Promise<IPlayerData> {
    const playerReference: any = await PlayerServices.getPlayerReference(rtdbRoomId, isPlayerOne);

    const playerDoc = await playerReference.get();
    const playerValues: IPlayerData = await playerDoc.val();

    return playerValues;
  }

  static async setPlayerTwoAtRoom(name: string, roomId: string): Promise<any> {
    try {
      await PlayerServices.getPlayerByName(name)

      const playerTwo: IPlayerData = await PlayerServices.createNewPlayer(name);
      const roomRtdbRef            = await RoomServices.getRtdbRoomReference(roomId);

      await roomRtdbRef.update({ playerTwo: playerTwo });

      const rtdbRoomDoc: any = await roomRtdbRef.get();
      const rtdbRoomData: any = await rtdbRoomDoc.val();

      return rtdbRoomData;
    } catch (err) {
      throw new Error("Failed to add new player at room. Try again later");
    }
  }
}
