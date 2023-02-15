import { IMessage } from "../message-interfaces";

export interface IRoomData {
  id: string;
  rtdbRoomId?: string;
}

export interface IRoomResponse extends IMessage {
  roomData: IRoomData;
}

export interface IRtdbRoomResponse extends IMessage {
  rtdbRoomId: string;
}

export interface IRoomId {
  roomId: string;
}
