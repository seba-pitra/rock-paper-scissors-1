import { IMessage } from "../message-interfaces";

type Choise =  "clean" | "rock" | "paper" | "scissors";

export interface IPlayerData {
  id?:      string;
  choise?:  Choise;
  history?: number;
  name?:    string;
  online?:  boolean;
  start?:   boolean;
}

export interface IPlayerResponse extends IMessage {
  playerData: IPlayerData;
}

export interface IParamsUpdatePlayer {
  choise?:      Choise;
  isPlayerOne:  boolean;
  losses?:      number;
  online?:      boolean;
  roomId:       string;
  start?:       boolean;
  victories?:   number;
}
