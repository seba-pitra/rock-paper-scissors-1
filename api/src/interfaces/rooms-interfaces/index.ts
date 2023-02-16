import { IMessage } from "../message-interfaces";
import { IPlayerData } from "../player-interfaces";

export interface IRoomData {
  id: string;
  rtdbRoomId: string;
  playerOne: IPlayerData;
  playerTwo?: IPlayerData;
}

export interface IRtdbRoom {
  id: string;
  playerOne: IPlayerData;
  playerTwo?: IPlayerData;
}

export interface IRoomResponse extends IMessage {
  roomData: IRoomData;
}

export interface IRtdbRoomResponse extends IMessage {
  rtdbRoomData: IRtdbRoom;
}

export interface IRoomId {
  roomId: string;
}
