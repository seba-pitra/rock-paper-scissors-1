export interface IMessage {
  msg: string;
}

export interface IRoomId {
  roomId: string;
}

export interface IPlayerResponse extends IMessage {
  playerId: string;
}

export interface IParamsUpdatePlayer extends IRoomId {
  isPlayerOne: boolean;
  online: boolean;
  start: boolean;
  name: string;
}
