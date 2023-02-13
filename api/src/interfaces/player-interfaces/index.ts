export interface IPlayerResponse {
  msg: string;
  playerId: string;
}

export interface IError {
  msg: string;
}

export interface IParamsUpdatePlayer {
  roomId: string;
  isPlayerOne: boolean;
  online: boolean;
  start: boolean;
  name: string;
}
