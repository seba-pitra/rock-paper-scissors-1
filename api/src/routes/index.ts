import { Router } from "express";
import playerRouter from "./PlayerRouter";
import roomsRouter from "./roomsRouter";

const router = Router();

router.use("/player", playerRouter);
router.use("/rooms", roomsRouter);

export default router;
