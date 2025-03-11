import jwt from "jsonwebtoken";
import { UserProps } from "../models/User/User.types";
import { Response } from "express";
import { API_CONFIG } from "../config";

export const setCookie = (user: UserProps, res: Response) => {
  const token = createToken(user);

  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);

  res.cookie(API_CONFIG.authCookie, token, {
    domain: API_CONFIG.production ? "example.com" : "127.0.0.1",
    secure: API_CONFIG.production ? true : false,
    expires: expireDate,
    httpOnly: true,
    sameSite: "strict",
  });
};

export const removeCookie = (res: Response) => {
  res.cookie(API_CONFIG.authCookie, "", {
    domain: API_CONFIG.production ? "example.com" : "127.0.0.1",
    secure: API_CONFIG.production ? true : false,
    expires: new Date(1),
    httpOnly: true,
    sameSite: "strict",
  });
};

export const createToken = (user: UserProps) => {
  return jwt.sign({ _id: user._id }, API_CONFIG.jwtSecret, {
    expiresIn: API_CONFIG.jwtExpiresIn,
  });
};
