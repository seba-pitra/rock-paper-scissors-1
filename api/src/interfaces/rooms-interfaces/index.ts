import { IPlayerData } from "../player-interfaces";

export interface IRoomData {
  id:           string;
  playerOne:    IPlayerData;
  playerTwo?:   IPlayerData;
  rtdbRoomId:   string;
}
