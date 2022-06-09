import {Router} from "express";

import { validateToken } from "../middlewares/authMiddleware.js"
import { shortenUrl, getUserUrls } from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateToken, shortenUrl);
urlsRouter.get("/urls/:id", validateToken, getUserUrls);

export default urlsRouter;