import express from "express";
import userRouter from "./user.route.ts";
import eventRouter from "./event.route.ts";
import { isUserAuthenticated } from "../middleware/auth.middleware.ts";
const router = express.Router();

router.use("/", userRouter);
router.use("/event", isUserAuthenticated, eventRouter);

export { router };
