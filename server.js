import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";

// config
const app = express();
app.use(cors());
app.use(json());
dotenv.config();

// routes
app.use(authRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(chalk.bold.green(`Server is running on port ${port}.`)));