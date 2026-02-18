import express from "express";
import userRouter from "./user.route.ts";
const router = express.Router();

router.use("/", userRouter);

export { router };
