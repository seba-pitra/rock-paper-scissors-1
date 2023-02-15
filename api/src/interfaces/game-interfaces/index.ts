import { IRoomId } from "../player-interfaces";

export interface IParamsChoosePlay extends IRoomId {
  choise: string;
  isPlayerOne: boolean;
}
