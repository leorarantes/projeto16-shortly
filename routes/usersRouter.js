import {Router} from "express";

import { validateToken } from "../middlewares/authMiddleware.js";
import { getUserUrls } from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.get("/users/:id", validateToken, getUserUrls);

export default usersRouter;