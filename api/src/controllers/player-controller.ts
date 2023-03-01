import PlayerServices      from "../services/player-services";
import {IMessage}          from "../interfaces/message-interfaces";
import {Request, Response} from "express";
import {IPlayerData, IPlayerResponse} from "../interfaces/player-interfaces";

export default class PlayerController {
  async signUp( req: Request, res: Response<IPlayerResponse | IMessage> ): Promise<Response> {
    try {
      const {name} = req.body;

      if (!name) throw new Error("There are missing values");

      const playerData: IPlayerData = await PlayerServices.createNewPlayer(name);

      return res.status(201).json({msg: "Player one created successfully", playerData: playerData});
    } catch (err) {
      return res.status(400).json({msg: err.message});
    }
  }

  async addPlayerTwo(req: Request, res: Response): Promise<Response> {
    try {
      const {name}   = req.body;
      const {roomId} = req.params;

      if (!roomId || !name) throw new Error("There are missing values");

      const rtdbRoomData = await PlayerServices.setPlayerTwoAtRoom(name, roomId);

      return res.status(201).json({ rtdbRoomData: rtdbRoomData, msg: "Player added in the room successfully" });
    } catch (err) {
      return res.status(400).json({msg: err.message});
    }
  }

  async updatePlayerStatus( req: Request, res: Response<IPlayerResponse | IMessage>): Promise<Response> {
    try {
      const {roomId}    = req.params;
      const {online}    = req.body;
      const {start}     = req.body;
      const isPlayerOne = Boolean(req.query.isPlayerOne);

      if (!roomId || online === undefined || start === undefined || isPlayerOne === undefined) {
        throw new Error("There are missing values");
      }

      const playerData: IPlayerData = await PlayerServices.updatePlayerData({
          roomId,
          isPlayerOne,
          online,
          start,
      });

      return res.status(200).json({ playerData: playerData, msg: "Player updated successfully" });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async updatePlayerChoose(req: Request, res: Response<IPlayerResponse | IMessage> ): Promise<Response> {
    try {
      const { roomId }  = req.params;
      const { choise }  = req.body;
      const isPlayerOne = Boolean(req.query.isPlayerOne);

      if (!roomId || !choise || isPlayerOne === undefined) {
        throw new Error("There are missing values");
      }

      const newPlayerValues: IPlayerData = await PlayerServices.updatePlayerData({
        roomId,
        choise,
        isPlayerOne,
      });

      return res.status(200).json({ msg: "Player choise updated successfully", playerData: newPlayerValues });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async updatePlayerHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId }    = req.params;
      const { victories } = req.body;
      const { losses }    = req.body;
      const isPlayerOne   = Boolean(req.query.isPlayerOne);

      if (!roomId || isPlayerOne === undefined) throw new Error("There are missing values");

      const newPlayerValues: IPlayerData = await PlayerServices.updatePlayerData({
        roomId,
        victories,
        losses,
        isPlayerOne,
      });

      return res.status(400).json({ msg: "Player history updated successfully", playerData: newPlayerValues });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
