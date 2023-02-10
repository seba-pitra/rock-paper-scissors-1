import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import RoomServices from "../services/rooms-services";

export default class RoomsController {
  async createRoomPlayerOne(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;

      const userDocFoundBoolean = await PlayerServices.searchUserById(userId);
      if (!userDocFoundBoolean) throw new Error("User does not exists");

      const roomShorterId = await RoomServices.createRoomInDatabase(userId);

      const response = { msg: "Room created successfully", id: roomShorterId };
      return res.status(201).json(response);
    } catch (err) {
      return res.json(404).json({ msg: err.message });
    }
  }
}
