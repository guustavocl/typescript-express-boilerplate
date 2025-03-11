import bodyParser from "body-parser";
import timeout from "connect-timeout";
import cookies from "cookie-parser";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { API_CONFIG } from "./config";
import { errorHandler } from "./middlewares/errors.middleware";
import { rateLimiter } from "./middlewares/limiter.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { rules } from "./middlewares/rules.middleware";
import { router } from "./routes";
import logger from "./utils/logger";
import helmet from "helmet";

const app = express();

mongoose
  .connect(API_CONFIG.mongoose.url, API_CONFIG.mongoose.options)
  .then(() => {
    logger.info("Mongoose successfully connected!");
    runServer();
  })
  .catch(error => {
    logger.error(error, "Mongoose error");
  });

const runServer = () => {
  /* CONFIGS */
  app.use(helmet());
  app.use(timeout(API_CONFIG.timeout));
  app.use(bodyParser.json({ limit: API_CONFIG.requestSizeLimit }));
  app.use(bodyParser.urlencoded({ limit: API_CONFIG.requestSizeLimit, extended: true }));

  /* LOGGER */
  app.use(requestLogger());

  /* RULES & COOKIES */
  app.use(rules());
  app.use(cookies());

  /* APLICATION RATE LIMITER */
  app.use(rateLimiter());

  /*  ROUTES DECLARATION */
  app.use(router);

  /* ERROR HANDLING */
  app.use(errorHandler());

  http.createServer(app).listen(API_CONFIG.port, () => logger.info(`Server running on port ${API_CONFIG.port}`));
};
