import { Request, Response, NextFunction } from "express";

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientKey = req.header("x-api-key");
  const apiKey = process.env.API_KEY;
  if (!clientKey || clientKey !== apiKey) {
    return res.status(401).json({ success: false, message: "Unauthorized: invalid or missing API key" });
  }
  next();
}
