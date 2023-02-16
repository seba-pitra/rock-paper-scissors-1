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

      const playerData: IPlayerData = await PlayerServices.addNewPlayer(name);

      return res.status(201).json({
        msg: "Player one created successfully",
        playerData: playerData,
      });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async addPlayerTwo(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const { name } = req.body;
      if (!roomId) throw new Error("There are missing values");

      const rtdbRoomData = await PlayerServices.addPlayerTwoAtRoom(
        name,
        roomId
      );

      return res.status(201).json({
        rtdbRoomData: rtdbRoomData,
        msg: "Player added in the room successfully",
      });
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

  async choosePlay(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const { choise } = req.body;
      const isPlayerOne = Boolean(req.query.isPlayerOne);

      if (!roomId || !choise || isPlayerOne === undefined)
        throw new Error("There are missing values");

      await PlayerServices.choosePlayService({
        roomId,
        choise,
        isPlayerOne,
      });

      return res
        .status(200)
        .json({ msg: "Player choise updated successfully" });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async updatePlayerHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const { victories } = req.body;
      const isPlayerOne = Boolean(req.query.isPlayerOne);

      if (!roomId || !victories || isPlayerOne === undefined)
        throw new Error("There are missing values");

      await PlayerServices.updatePlayerHistoryService({
        roomId,
        victories,
        isPlayerOne,
      });

      return res
        .status(400)
        .json({ msg: "Player history updated successfully" });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async cleanPlayerChoise(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const isPlayerOne = Boolean(req.query.isPlayerOne);

      if (!roomId || isPlayerOne === undefined)
        throw new Error("There are missing values");

      const newPlayerValues = await PlayerServices.cleanPlayerChoiseService({
        roomId,
        isPlayerOne,
      });

      return res.status(200).json({
        playerData: newPlayerValues,
        msg: "Choise was deleted successfully",
      });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
