import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

interface RequestMetrics {
  startTime: [number, number];
  requestId: string;
}

const getDurationInSeconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9;
  const diff = process.hrtime(start);
  const seconds = diff[0] + diff[1] / NS_PER_SEC;
  return seconds.toFixed(4);
};

// Simple shorter ID generator
const generateShortId = () => Math.random().toString(36).substring(2, 12);

export const requestLogger = () => (req: Request, res: Response, next: NextFunction) => {
  const metrics: RequestMetrics = {
    startTime: process.hrtime(),
    requestId: req.headers["x-request-id"]?.toString() || generateShortId(),
  };

  req.headers["x-request-id"] = metrics.requestId;

  logger.http(
    `→ REQ [${metrics.requestId}] [${req.method}] IP: [${req.socket.remoteAddress}] PATH: [${req.originalUrl}]`
  );

  // Log response
  res.on("finish", () => {
    const duration = getDurationInSeconds(metrics.startTime);
    const statusSymbol = res.statusCode >= 400 ? "⚠" : "←";

    logger.http(
      `${statusSymbol} RES [${metrics.requestId}] [${req.method.padEnd(4, " ")} ${
        res.statusCode
      }] [${duration}s] PATH: [${req.originalUrl}] USER: [${res.locals?.userPayload?._id || "none"}]`
    );
  });

  // Log if request errors out
  res.on("error", error => {
    logger.error(
      `⚠ ERROR [${metrics.requestId}] [${req.method} IP: [${req.socket.remoteAddress}] PATH: [${req.originalUrl}] ERROR: ${error.message}`,
      {
        error: error.message,
        stack: error.stack,
        userId: res.locals?.userPayload?._id || "none",
      }
    );
  });

  next();
};
