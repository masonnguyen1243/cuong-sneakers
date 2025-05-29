import authRoutes from "./authRoutes";

export const initRoutes = (app: any) => {
  app.use("/api/auth", authRoutes);
};
