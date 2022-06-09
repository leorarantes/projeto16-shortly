import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import urlsRouter from "./routes/urlsRouter.js";

// config
const app = express();
app.use(cors());
app.use(json());
dotenv.config();

// routes
app.use(authRouter);
app.use(urlsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(chalk.bold.green(`Server is running on port ${port}.`)));