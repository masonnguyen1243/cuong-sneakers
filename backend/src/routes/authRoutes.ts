import express from "express";
import { authControllers } from "~/controllers/authControllers";

const router = express.Router();

router.post("/register", authControllers.register);

export default router;
