import {Router} from "express";

import { validateToken } from "../middlewares/authMiddleware.js"
import { shortenUrl, getUserUrls, openShortUrl } from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateToken, shortenUrl);
urlsRouter.get("/urls/:id", validateToken, getUserUrls);
urlsRouter.get("/urls/open/:shortUrl", openShortUrl);

export default urlsRouter;