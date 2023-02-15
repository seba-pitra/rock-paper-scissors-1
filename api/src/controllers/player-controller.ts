import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import { IPlayerData, IPlayerResponse } from "../interfaces/player-interfaces";
import { IMessage } from "../interfaces/message-interfaces";

export default class PlayerController {
  async signUp(
    req: Request,
    res: Response<IPlayerResponse | IMessage>
  ): Promise<Response> {
    try {
      const { name } = req.body;
      if (!name) throw new Error("There are missing values");

      const playerId: string = await PlayerServices.addnewUser(name);

      return res.status(201).json({
        msg: "Player one created successfully",
        playerData: { id: playerId },
      });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async addPlayerTwo(req: Request, res: Response<IMessage>): Promise<Response> {
    try {
      const { roomId } = req.body;
      if (!roomId) throw new Error("There are missing values");

      const message: string = await PlayerServices.addPlayerTwoAtRoom(roomId);

      return res.status(201).json({ msg: message });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async updatePlayerStatus(
    req: Request,
    res: Response<IPlayerResponse | IMessage>
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

      const playerData: IPlayerData =
        await PlayerServices.updatePlayerStatusService({
          roomId,
          isPlayerOne,
          online,
          start,
        });

      //Response: should be an object with playerData(object) and a message
      return res
        .status(200)
        .json({ playerData: playerData, msg: "Player updated successfully" });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
