/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from "winston";
import { API_CONFIG } from "../config";

class Logger {
  private logger: winston.Logger;

  constructor() {
    const enumerateErrorFormat = winston.format((info: any) => {
      if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
      }
      return info;
    });

    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      level: API_CONFIG.production ? "info" : "debug",
      format: winston.format.combine(
        enumerateErrorFormat(),
        API_CONFIG.production ? winston.format.uncolorize() : winston.format.colorize(),
        winston.format.splat(),
        winston.format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
        winston.format.printf(
          (info: any) =>
            `> ${info.timestamp} [${info.level}]: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : " ")
        )
      ),
      transports: API_CONFIG.production
        ? [
            new winston.transports.Console({
              stderrLevels: ["info", "error", "http"],
            }),
            new winston.transports.File({
              filename: "./logs/error.log",
              level: "error",
              maxsize: 10 * 1000 * 1000, // 10 Mb
              maxFiles: 10,
              tailable: true,
            }),
            new winston.transports.File({
              filename: "./logs/info.log",
              level: "info",
              maxsize: 10 * 1000 * 1000, // 10 Mb
              maxFiles: 10,
              tailable: true,
            }),
            new winston.transports.File({
              filename: "./logs/notice.log",
              level: "notice",
              maxsize: 10 * 1000 * 1000, // 10 Mb
              maxFiles: 10,
              tailable: true,
            }),
            new winston.transports.File({
              filename: "./logs/alert.log",
              level: "alert",
              maxsize: 10 * 1000 * 1000, // 10 Mb
              maxFiles: 10,
              tailable: true,
            }),
          ]
        : [
            new winston.transports.Console({
              stderrLevels: ["info", "error", "debug", "http", "alert", "notice", "warning"],
            }),
          ],
    });
  }

  // Proxy Winston's native methods
  info(message: string, ...meta: any[]): Logger {
    this.logger.info(message, ...meta);
    return this;
  }

  error(message: any, ...meta: any[]): Logger {
    this.logger.error(message, ...meta);
    return this;
  }

  debug(message: string, ...meta: any[]): Logger {
    this.logger.debug(message, ...meta);
    return this;
  }

  http(message: string, ...meta: any[]): Logger {
    this.logger.http(message, ...meta);
    return this;
  }

  job(message: string, ...meta: any[]): Logger {
    this.logger.notice(message, ...meta);
    return this;
  }

  alert(message: string, ...meta: any[]): Logger {
    this.logger.alert(message, ...meta);
    return this;
  }

  warn(message: string, ...meta: any[]): Logger {
    this.logger.warn(message, ...meta);
    return this;
  }
}

// Create and export a singleton instance
const logger = new Logger();
export default logger;
