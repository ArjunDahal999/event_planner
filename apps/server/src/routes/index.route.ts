import express from "express";
import userRouter from "./user.route";
import eventRouter from "./event.route";
import { isUserAuthenticated } from "../middleware/auth.middleware";
import rsvpRouter from "./rsvp.route";
const router: express.Router = express.Router();

router.use("/", userRouter);
router.use("/event", eventRouter);
router.use("/rsvp", rsvpRouter);
export { router };
