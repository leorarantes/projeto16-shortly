import {Router} from "express";

import { validateToken } from "../middlewares/authMiddleware.js"
import { shortenUrl, openShortUrl, getUrl, deleteUrl} from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateToken, shortenUrl);
urlsRouter.get("/urls/open/:shortUrl", openShortUrl);
urlsRouter.get("/urls/:id", getUrl);
urlsRouter.delete("/urls/:id", validateToken, deleteUrl);

export default urlsRouter;