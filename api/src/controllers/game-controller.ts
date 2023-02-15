import { Request, Response } from "express";
import GameServices from "../services/game-services";

export default class GameController {
  async choosePlay(req: Request, res: Response): Promise<Response> {
    try {
      const paramsToService = {
        roomId: req.params.roomId,
        isPlayerOne: Boolean(req.query.isPlayerOne),
        choise: req.body.choise,
      };

      const response = await GameServices.choosePlayService(paramsToService);

      return res.status(200).json(response);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async updatePlayerHistory(req: Request, res: Response): Promise<Response> {
    try {
      const paramsToService = {
        roomId: req.params.roomId,
        isPlayerOne: Boolean(req.query.isPlayerOne),
        victories: req.body.victories,
      };

      const response = await GameServices.updatePlayerHistoryService(
        paramsToService
      );

      return res.status(400).json(response);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
