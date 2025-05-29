import UserModel from "~/models/userModel";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

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
    console.error(`Error in register`);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: (error as Error).message });
  }
};

export const authControllers = { register };
