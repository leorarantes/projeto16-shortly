import { nanoid } from 'nanoid';

import { urlSchema } from "../schemas/urlSchema.js";
import urlsRepositories from "../repositories/urlsRepositories.js";

export async function shortenUrl(req, res) {
    const { error } = urlSchema.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        const { user } = res.locals;
        const existingUrl = await urlsRepositories.getUrl({ userId: user.id, url: req.body.url });
        if(existingUrl.rowCount > 0) {
            res.status(201).send({shortUrl: existingUrl.rows[0].shortUrl});
        }
        else {
            const shortUrl = nanoid();
            await urlsRepositories.insertUrl(user.id, req.body.url, shortUrl);

            res.status(201).send({shortUrl});
        }
    } catch (error) {
        console.log("Error shortening url.", error);
        res.status(500).send("Error shortening url.");
    }
}

export async function openShortUrl(req, res) {
    try {
        const { shortUrl } = req.params;
        const existingUrl = await urlsRepositories.getUrl({ shortUrl });

        if(existingUrl.rowCount > 0) {
            const visitCountPlusOne = existingUrl.rows[0].visitCount + 1;
            await urlsRepositories.updateVisitCount(visitCountPlusOne, shortUrl)
            
            res.redirect(existingUrl.rows[0].url);
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.log("Error opening short url.", error);
        res.status(500).send("Error opening short url.");
    }
}

export async function getUrl(req, res) {
    try {
        const urlId = parseInt(req.params.id);

        const existingUrl = await urlsRepositories.getUrl({ urlId });
        if(existingUrl.rowCount > 0) {
            const {id, shortUrl, url} = existingUrl.rows[0];
            res.status(200).send({id, shortUrl, url});
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.log("Error recovering url.", error);
        res.status(500).send("Error recovering url.");
    }
}

export async function deleteUrl(req, res) {
    try {
        const urlId = parseInt(req.params.id);
        const { user } = res.locals;

        const existingUrl = await urlsRepositories.getUrl({ urlId });
        if(existingUrl.rowCount === 0) return res.sendStatus(404);
        if(existingUrl.rows[0].userId !== user.id) return res.sendStatus(401);

        await urlsRepositories.deleteUrl(urlId);

        res.sendStatus(204);
    } catch (error) {
        console.log("Error deleting url.", error);
        res.status(500).send("Error deleting url.");
    }
}