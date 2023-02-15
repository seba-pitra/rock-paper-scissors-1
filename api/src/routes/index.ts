import { Router } from "express";
import playerRouter from "./player-router";
import roomsRouter from "./rooms-router";
import gameRouter from "./game-router";

const router: Router = Router();

router.use("/player", playerRouter);
router.use("/rooms", roomsRouter);
router.use("/game", gameRouter);

export default router;
