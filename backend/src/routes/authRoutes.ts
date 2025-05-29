import express from "express";
import { authControllers } from "~/controllers/authControllers";
import { verifyToken, isAdmin } from "~/middlewares/authMiddlewares";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";

const router = express.Router();

router.post("/register", authControllers.register);

router.post("/login", authControllers.login);

router.put("/verify-account", authControllers.verifyAccount);

router.delete("/logout", authControllers.logout);

router.put(
  "/change-avatar",
  verifyToken,
  multerUploadMiddleware.upload.single("avatar"),
  authControllers.changeAvatarUser,
);

export default router;
