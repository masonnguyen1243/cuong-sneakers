import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "~/config/environments";
import connectDB from "~/config/db";
import { initRoutes } from "~/routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    // credentials: true,
    // origin: "http://localhost:5173",
    // optionsSuccessStatus: 200,
    // methods: "GET, PUT, DELETE, POST",
  }),
);

const PORT = ENV.PORT;

connectDB();
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
