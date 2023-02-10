import { Router } from "express";
import PlayerController from "../controllers/playerController";

const playerRouter = Router();
const playerController = new PlayerController();

playerRouter.post("/signup", playerController.signUp);
// playerRouter.post("/new-player", playerController.addPlayerTwo);

export default playerRouter;
