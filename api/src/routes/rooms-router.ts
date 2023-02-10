import { Router } from "express";
import Rooms from "../controllers/roomsController";
const roomsRouter = Router();

const roomController = new Rooms();

roomsRouter.post("/", roomController.createNewRoomWithPlayerOne);

export default roomsRouter;
