import { Router } from "express";
import GameController from "../controllers/game-controller";

const gameRouter = Router();
const gameController = new GameController();

gameRouter.put("/play/:roomId", gameController.choosePlay);

export default gameRouter;
