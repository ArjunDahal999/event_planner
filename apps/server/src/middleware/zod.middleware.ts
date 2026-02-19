import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import logger from "../libs/winston.ts";

export function zodMiddleware(
  err: unknown,
  _: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.log("Error in zodMiddleware:", err);
  if (err instanceof z.ZodError) {
    res.status(400).json({
      message: "Validation error",
      success: false,
      statusCode: 400,
      error: err.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      })),
    });
    logger.error(`Validation error: ${JSON.stringify(err.issues)}`);
    return;
  } else if (err instanceof Error) {
    const error = err as Error & { statusCode?: number };
    res.status(error.statusCode ?? 400).json({
      success: false,
      message: err.message,
      statusCode: error.statusCode ?? 400,
    });
    logger.error(`Error: ${err.message}`);
    return;
  }
  logger.error(`Unexpected error: ${JSON.stringify(err)}`);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error",
  });
}
