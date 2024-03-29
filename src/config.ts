import dotenv from "dotenv";
dotenv.config();
const production = process.env.NODE_MODE === "production";

export const config = {
  env: process.env.NODE_MODE,
  production: production,
  port: production ? 3000 : 3333,
  timeout: "30s",
  requestSizeLimit: "10mb",
  mongoose: {
    url: (production ? process.env.MONGO_PRODUCTION_URL : process.env.MONGO_DEVELOPMENT_URL) || "",
    options: {
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: "24h",
  authCookie: "express_auth",
};
