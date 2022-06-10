import {Router} from "express";

import { validateToken } from "../middlewares/authMiddleware.js"
import { shortenUrl, openShortUrl, deleteUrl} from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateToken, shortenUrl);
urlsRouter.get("/urls/open/:shortUrl", openShortUrl);
urlsRouter.delete("/urls/:id", validateToken, deleteUrl);

export default urlsRouter;