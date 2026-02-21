import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateRequest =
  ({
    schema,
    scope,
  }: {
    schema: ZodType<any>;
    scope?: "body" | "query" | "params";
  }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = scope ? req[scope] : req.body;
      const validatedData = schema.parse(data);
      if (scope === "query") {
        Object.assign(req[scope], validatedData);
        //req[scope] = { ...req[scope], ...validatedData }; can not be assigned because req.params is a read only property
      } else if (scope === "params") {
        Object.assign(req[scope], validatedData);
      } else {
        req.body = validatedData;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
