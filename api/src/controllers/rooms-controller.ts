import { Request, Response } from "express";
import PlayerServices from "../services/player-services";
import RoomServices from "../services/rooms-services";
import { IMessage } from "../interfaces/message-interfaces";
import { IPlayerData } from "../interfaces/player-interfaces";

export default class RoomsController {
  async createRoomPlayerOne( req: Request, res: Response<FirebaseFirestore.DocumentData | IMessage> ): Promise<Response> {
    try {
      const { playerId } = req.body;

      if (!playerId) throw new Error("There are missing playerId");

      const playerData: IPlayerData = await PlayerServices.searchUserById( playerId );

      const newRoomData: FirebaseFirestore.DocumentData = await RoomServices.createRoomInDatabase(playerData);

      return res.status(201).json({ msg: "Room created successfully", roomData: newRoomData });
    } catch (err) {
      return res.status(404).json({ msg: err.message });
    }
  }
}
