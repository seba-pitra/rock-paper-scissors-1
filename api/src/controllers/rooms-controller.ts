import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import RoomServices from "../services/rooms-services";
import * as roomInterfaces from "../interfaces/rooms-interfaces";
import { IError } from "../interfaces/error-interfaces";

export default class RoomsController {
  async createRoomPlayerOne(
    req: Request,
    res: Response<roomInterfaces.IRoomResponse | IError>
  ): Promise<Response> {
    try {
      const { userId } = req.body;

      const userDocFoundBoolean = await PlayerServices.searchUserById(userId);
      if (!userDocFoundBoolean) throw new Error("User does not exists");

      const roomShorterId = await RoomServices.createRoomInDatabase(userId);

      const response = {
        msg: "Room created successfully",
        roomId: roomShorterId,
      };

      return res.status(201).json(response);
    } catch (err) {
      return res.status(404).json({ msg: err.message });
    }
  }

  async getRtdbRoomId(
    req: Request,
    res: Response<roomInterfaces.IRtdbRoomResponse | IError>
  ): Promise<Response> {
    try {
      const { roomId } = req.body;

      const rtdbRoomId = await RoomServices.getRtdbRoomId(roomId);

      return res.status(200).json({
        msg: "Realtime room got successfully",
        rtdbRoomId: rtdbRoomId,
      });
    } catch (err) {
      return res.status(404).json({ msg: err.message });
    }
  }
}
