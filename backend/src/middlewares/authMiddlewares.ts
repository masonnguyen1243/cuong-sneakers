import jwt from "jsonwebtoken";
import { ENV } from "~/config/environments";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const clientAccessToken = req.cookies?.accessToken;

  if (!clientAccessToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid Token" });
  }

  try {
    if (!ENV.ACCESS_TOKEN_SECRET_KEY) {
      console.error("JWT Secret Key is not defined.");
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Server configuration error: JWT secret key missing." });
    }

    const decoded = jwt.verify(clientAccessToken, ENV.ACCESS_TOKEN_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    if (error?.message?.includes("jwt expired")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({ succcess: false, message: "REQUIRE ADMIN ROLE!" });
  }
};
