import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import PlayerServices from "../services/player-services";

export default class PlayerController {
  async signUp(req: Request, res: Response): Promise<any> {
    try {
      const { nombre } = req.body;
      const userFound = await PlayerServices.searchUserByName(nombre);
      //If it isn't empty...
      if (!userFound) throw new Error("user already exists with this name");

      const idNewUser = await PlayerServices.addnewUser(nombre);

      res.status(201).json({ id: idNewUser });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  }

  // async addPlayerTwo(req: Request, res: Response): Promise<void> {
  //   const { roomId } = req.body;
  //   const rooms = await roomsCollection.doc(roomId).get();
  //   console.log(rooms.data());
  //   // .then((doc) => {
  //   //   const rtdbRoom = doc.data();
  //   //   const rtdbRoomId = rtdbRoom.rtdbRoom;
  //   //   const roomRef = rtdb.ref("/rooms/" + rtdbRoomId);
  //   //   roomRef
  //   //     .update({
  //   //       playerTwo: "new Player",
  //   //     })
  //   res.json(rooms);
  // }
}
