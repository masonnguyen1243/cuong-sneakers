import UserModel from "~/models/userModel";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { generateAccessToken, generateRefreshToken } from "~/utils/jwt";
import ms from "ms";
import { CookieOptions } from "express";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Fields required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verifyToken: uuidv4(),
    });

    user.save();

    return res.status(StatusCodes.CREATED).json({ success: true, message: "Registration successfully!", data: user });
  } catch (error) {
    console.error(`Error in register user`);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Fields required!" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NON_AUTHORITATIVE_INFORMATION)
        .json({ success: false, message: "Invalid email and/or password" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res
        .status(StatusCodes.NON_AUTHORITATIVE_INFORMATION)
        .json({ success: false, message: "Invalid email and/or password" });
    }

    if (!user.isActive) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Your account is not active. Please check your email!" });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged in successfully!",
      data: {
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`Error in login user`);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
  }
};

const verifyAccount = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Fields required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
    }

    if (user.isActive) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, message: "Your account is already verify. Please login to enjoy our service!" });
    }

    if (token !== user.verifyToken) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({ success: false, message: "Invalid Token" });
    }

    user.isActive = true;
    user.verifyToken = null;

    user.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Verification successfully. Please login to enjoy our service", data: user });
  } catch (error) {
    console.error(`Error in verifyAccount user`);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
  }
};

export const authControllers = { register, login, verifyAccount };
