import { IPlayerData } from "../player-interfaces";

export interface IRoomData {
  id: string;
  rtdbRoomId: string;
  playerOne: IPlayerData;
  playerTwo?: IPlayerData;
}
