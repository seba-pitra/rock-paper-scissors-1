import { IMessage } from "../message-interfaces";

export interface IPlayerData {
  id?: string;
  name?: string;
  online?: boolean;
  start?: boolean;
  choise?: string;
  history?: number;
}

export interface IPlayerResponse extends IMessage {
  playerData: IPlayerData;
}

export interface IParamsUpdatePlayer {
  isPlayerOne: boolean;
  online: boolean;
  start: boolean;
  roomId: string;
}
