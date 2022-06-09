import {Router} from "express";

import { validateToken } from "../middlewares/authMiddleware.js"
import { shortenUrl } from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateToken, shortenUrl);

export default urlsRouter;