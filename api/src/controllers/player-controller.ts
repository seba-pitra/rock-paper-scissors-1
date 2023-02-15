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
      const paramsToService = {
        roomId: req.params.roomId,
        isPlayerOne: req.query.isPlayerOne === "true",
        online: req.body.online,
        start: req.body.start,
        name: req.body.name,
      };

      const response = await PlayerServices.updatePlayerStatusService(
        paramsToService
      );

      return res.status(200).json({ msg: response.msg });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
