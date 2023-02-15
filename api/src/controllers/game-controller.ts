import { Request, Response } from "express";
import GameServices from "../services/game-services";

export default class GameController {
  async choosePlay(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.params;
      const { choise } = req.body;
      const isPlayerOne = Boolean(req.query.isPlayerOne);

      if (!roomId || !choise || isPlayerOne === undefined)
        throw new Error("There are missing values");

      const response = await GameServices.choosePlayService({
        roomId,
        choise,
        isPlayerOne,
      });

      return res.status(200).json(response);
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

      const response = await GameServices.updatePlayerHistoryService({
        roomId,
        victories,
        isPlayerOne,
      });

      return res.status(400).json(response);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
