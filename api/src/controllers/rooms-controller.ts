import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import RoomServices from "../services/rooms-services";
import {
  IRoomResponse,
  IRtdbRoomResponse,
} from "../interfaces/rooms-interfaces";
import { IMessage } from "../interfaces/message-interfaces";

export default class RoomsController {
  async createRoomPlayerOne(
    req: Request,
    res: Response<IRoomResponse | IMessage>
  ): Promise<Response> {
    try {
      const { userId } = req.body;
      if (!userId) throw new Error("There are missing userId");

      await PlayerServices.searchUserById(userId);

      const roomShorterId = await RoomServices.createRoomInDatabase(userId);

      return res.status(201).json({
        msg: "Room created successfully",
        roomData: { id: roomShorterId },
      });
    } catch (err) {
      return res.status(404).json({ msg: err.message });
    }
  }

  async getRtdbRoomId(
    req: Request,
    res: Response<IRtdbRoomResponse | IMessage>
  ): Promise<Response> {
    try {
      const { roomId } = req.body;
      if (!roomId) throw new Error("There are missing roomId");

      const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);

      return res.status(200).json({
        msg: "Realtime room got successfully",
        rtdbRoomId: rtdbRoomId,
      });
    } catch (err) {
      return res.status(404).json({ msg: err.message });
    }
  }
}
