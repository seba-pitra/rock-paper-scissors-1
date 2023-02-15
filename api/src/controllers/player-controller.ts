import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import { IPlayerResponse } from "../interfaces/player-interfaces";
import { IError } from "../interfaces/error-interfaces";

export default class PlayerController {
  async signUp(
    req: Request,
    res: Response<IPlayerResponse | IError>
  ): Promise<Response> {
    try {
      const { name } = req.body;
      if (!name) throw new Error("There are missing values");

      //If player not exists with this name, this function will give up a error
      await PlayerServices.searchUserByName(name);

      const idNewUser: string = await PlayerServices.addnewUser(name);

      return res
        .status(201)
        .json({ msg: "Player one created successfully", playerId: idNewUser });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async addPlayerTwo(
    req: Request,
    res: Response<IPlayerResponse | IError>
  ): Promise<Response> {
    try {
      const { roomId } = req.body;
      if (!roomId) throw new Error("There are missing values");
      const successMsg = await PlayerServices.addPlayerTwoAtRoom(roomId);
      return res.status(201).json({ msg: successMsg });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async updatePlayerStatus(
    req: Request,
    res: Response<IPlayerResponse | IError>
  ): Promise<Response> {
    try {
      const { roomId } = req.params;
      const isPlayerOne = Boolean(req.query.isPlayerOne);
      const { online } = req.body;
      const { start } = req.body;

      if (
        !roomId ||
        online === undefined ||
        start === undefined ||
        isPlayerOne === undefined
      )
        throw new Error("There are missing values");

      const response = await PlayerServices.updatePlayerStatusService({
        roomId,
        isPlayerOne,
        online,
        start,
      });

      return res.status(200).json({ msg: response.msg });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
