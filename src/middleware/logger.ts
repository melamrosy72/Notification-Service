import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationMs = (durationNs / 1_000_000).toFixed(1);
    const status = res.statusCode;
    console.log(`➡️  ${method} ${originalUrl} ${status} - ${durationMs} ms`);
  });

  next();
}


