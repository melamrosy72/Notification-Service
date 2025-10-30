import { Request, Response, NextFunction } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  } else {
    console.error("Error:", message);
  }

  return res.status(status).json({ success: false, message });
}
