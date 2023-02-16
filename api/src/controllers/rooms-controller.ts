import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import RoomServices from "../services/rooms-services";
import {
  IRoomData,
  IRoomResponse,
  IRtdbRoomResponse,
} from "../interfaces/rooms-interfaces";
import { IMessage } from "../interfaces/message-interfaces";

export default class RoomsController {
  async createRoomPlayerOne(
    req: Request,
    res: Response<FirebaseFirestore.DocumentData | IMessage>
  ): Promise<Response> {
    try {
      const { playerId } = req.body;
      if (!playerId) throw new Error("There are missing playerId");

      const playerData = await PlayerServices.searchUserById(playerId);

      const newRoomData: FirebaseFirestore.DocumentData =
        await RoomServices.createRoomInDatabase(playerData);

      return res.status(201).json({
        msg: "Room created successfully",
        roomData: newRoomData,
      });
    } catch (err) {
      return res.status(404).json({ msg: err.message });
    }
  }

  // async getRtdbRoomId(
  //   req: Request,
  //   res: Response<IRtdbRoomResponse | IMessage>
  // ): Promise<Response> {
  //   try {
  //     const { roomId } = req.body;
  //     if (!roomId) throw new Error("There are missing roomId");

  //     const rtdbRoomId: string = await RoomServices.getRtdbRoomId(roomId);

  //     return res.status(200).json({
  //       msg: "Realtime room got successfully",
  //       rtdbRoomId: rtdbRoomId,
  //     });
  //   } catch (err) {
  //     return res.status(404).json({ msg: err.message });
  //   }
  // }
}
