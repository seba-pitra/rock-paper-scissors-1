import { Router } from "express";
import PlayerController from "../controllers/player-controller";

const playerRouter = Router();
const playerController = new PlayerController();

playerRouter.post("/signup",             playerController.signUp);
playerRouter.post("/new-player/:roomId", playerController.addPlayerTwo);
playerRouter.put("/status/:roomId",      playerController.updatePlayerStatus);
playerRouter.put("/play/:roomId",        playerController.updatePlayerChoose);
playerRouter.put("/history/:roomId",     playerController.updatePlayerHistory);

export default playerRouter;
