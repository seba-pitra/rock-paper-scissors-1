import { IRoomId } from "../rooms-interfaces";

export interface IParamsChoosePlay extends IRoomId {
  choise: string;
  isPlayerOne: boolean;
}
