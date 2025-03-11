import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { UserProps } from "../models/User/User.types";
import { UserService } from "../services/User";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";
import { setCookie } from "../utils/jwt";
import { API_CONFIG } from "../config";

export const authenticate = (admin = false) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[API_CONFIG.authCookie];

    try {
      const payload = jwt.verify(token, API_CONFIG.jwtSecret);
      if (!payload) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
      let user = payload as UserProps | null;
      user = await UserService.findOne(user?._id);

      if (!user || user.isBanned) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      if (admin && !user.isAdmin) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      // Save user payload to use their infos on controller
      res.locals.userPayload = user;

      // Refreshing token
      setCookie(user, res);

      next();
    } catch (err) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
  });
