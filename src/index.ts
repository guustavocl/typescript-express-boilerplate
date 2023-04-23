import express from "express";
import http from "http";
import cors from "cors";
import timeout from "connect-timeout";
import bodyParser from "body-parser";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { reqLogger } from "./middleware/requestLogger";
import { rules } from "./middleware/rules";
import logger from "./utils/logger";
import pingRouteExample from "./routes/ping.routes";

const router = express();

const runServer = () => {
  /* CONFIGS */
  router.use(timeout("30s"));
  router.use(bodyParser.json({ limit: "10mb" }));
  router.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  router.use(cors());

  /* LOGGER */
  router.use(reqLogger());

  /* RULES */
  router.use(rules());

  /* RATE LIMITER */
  router.use(rateLimiter());

  /*  ROUTES */
  router.use("/ping", pingRouteExample);

  /*  NOT FOUND */
  router.get("*", (req, res) => res.status(404).json({ message: "Not Found" }));

  /* ERROR HANDLING */
  router.use(errorHandler());

  http.createServer(router).listen(3000, () => logger.info(`Server running on port 3000`));
};

runServer();
