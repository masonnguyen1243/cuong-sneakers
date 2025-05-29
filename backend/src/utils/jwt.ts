import jwt from "jsonwebtoken";
import { ENV } from "~/config/environments";

export const generateAccessToken = (id: any, role: string) => {
  const accessToken = jwt.sign({ id, role }, ENV.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: ENV.ACCESS_TOKEN_SECRET_EXPIRED,
  });

  return accessToken;
};

export const generateRefreshToken = (id: any, role: string) => {
  const refreshToken = jwt.sign({ id, role }, ENV.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: ENV.REFRESH_TOKEN_SECRET_EXPIRED,
  });

  return refreshToken;
};
