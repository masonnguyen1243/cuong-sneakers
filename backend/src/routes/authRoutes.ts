import express from "express";
import { authControllers } from "~/controllers/authControllers";

const router = express.Router();

router.post("/register", authControllers.register);

router.post("/login", authControllers.login);

router.put("/verify-account", authControllers.verifyAccount);

router.delete("/logout", authControllers.logout);

export default router;
