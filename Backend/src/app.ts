import express, { Application } from "express";
import routes from "./routes";
import globalErrorHandler from "./controllers/errorController";
import AppError from "./utils/appError";
import { DBconnection } from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";

import morgan = require("morgan");

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies in incoming requests
app.use(
  cors({
    origin: "*",
    credentials: true,
  }) as any
);
// Apply morgan middelware in development
app.use(morgan("dev"));

DBconnection();

// Routes
app.use("/api", routes);

app.all("*", (req: any, res: any, next: any) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

export default app;
