import { Router } from "express";
import RoomsController from "../controllers/rooms-controller";

const roomsRouter = Router();
const roomController = new RoomsController();

roomsRouter.post("/", roomController.createRoomPlayerOne);

export default roomsRouter;
