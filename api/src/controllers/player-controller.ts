import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import PlayerServices from "../services/player-services";

export default class PlayerController {
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { nombre } = req.body;
      //If player not exists with this name, give up a error
      await PlayerServices.searchUserByName(nombre);

      const idNewUser: string = await PlayerServices.addnewUser(nombre);

      return res.status(201).json({ id: idNewUser });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async addPlayerTwo(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId } = req.body;
      const successMsg = await PlayerServices.addPlayerTwoAtRoom(roomId);
      return res.status(201).json({ msg: successMsg });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
}
