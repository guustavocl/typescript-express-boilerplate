import dotenv from "dotenv";
dotenv.config();
const production = process.env.NODE_MODE === "production";

const mongooseConfig = {
  url: (production ? process.env.MONGO_PRODUCTION_URL : process.env.MONGO_DEVELOPMENT_URL) || "",
  options: {
    retryWrites: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const redisConfig = {
  host: (production ? process.env.REDIS_PRODUCTION_HOST : process.env.REDIS_DEVELOPMENT_HOST) || "",
  port: (production ? process.env.REDIS_PRODUCTION_PORT : process.env.REDIS_DEVELOPMENT_PORT) || 6379,
  password: process.env.REDIS_PWD || "",
};

const discordConfig = {
  ownerId: process.env.DISCORD_OWNER_ID || "",
  debugWebhookUrl: process.env.DISCORD_DEBUG_WEBHOOK_URL || "",
};

export const API_CONFIG = {
  env: process.env.NODE_MODE,
  production: production,
  port: production ? process.env.PORT : 3333,
  timeout: "60s",
  requestSizeLimit: "10mb",
  jwtSecret: process.env.JWT_AUTH_SECRET || "",
  jwtUser: process.env.JWT_USER_SECRET || "",
  jwtExpiresIn: "24h",
  authCookie: process.env.AUTH_COOKIE_NAME || "",
  userCookie: process.env.USER_COOKIE_NAME || "",
  cookieDomain: production ? "api.gus.sh" : "localhost",
  corsOrigin: production ? "https://api.gus.sh" : "http://localhost:3000",
  mongoose: mongooseConfig,
  redis: redisConfig,
  discord: discordConfig,
};
