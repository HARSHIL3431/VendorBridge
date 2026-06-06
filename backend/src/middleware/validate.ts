import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e: ZodIssue) => e.message).join(', ');
        res.status(400).json({
          success: false,
          message: `Validation error: ${message}`,
        });
        return;
      }
      next(error);
    }
  };
};
