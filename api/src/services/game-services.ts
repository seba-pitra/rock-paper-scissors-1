import RoomServices from "./rooms-services";
import PlayerServices from "./player-services";
import { IParamsChoosePlay } from "../interfaces/game-interfaces";
import { IMessage } from "../interfaces/player-interfaces";

export default class GameServices {
  static async choosePlayService(params: IParamsChoosePlay): Promise<IMessage> {
    const rtdbRoomId = await RoomServices.getRtdbRoomId(params.roomId);

    const roomRef = await PlayerServices.getPlayerRef(
      rtdbRoomId,
      params.isPlayerOne
    );

    await roomRef.update({ choise: params.choise });

    return { msg: "Player choise updated successfully" };
  }
}
