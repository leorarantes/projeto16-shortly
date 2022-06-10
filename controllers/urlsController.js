import { nanoid } from 'nanoid';

import connection from "../database.js";
import { urlSchema } from "../schemas/urlSchema.js";

export async function shortenUrl(req, res) {
    const { error } = urlSchema.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        const { user } = res.locals;
        const existingUrl = await connection.query("SELECT * FROM urls WHERE \"userId\" = $1 AND url = $2", [user.id, req.body.url]);
        if(existingUrl.rowCount > 0) {
            res.status(201).send({shortUrl: existingUrl.rows[0].shortUrl});
        }
        else {
            const shortUrl = nanoid();
            await connection.query("INSERT INTO urls (\"userId\", url, \"shortUrl\") VALUES ($1, $2, $3)", [user.id, req.body.url, shortUrl]);

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
        const existingUrl = await connection.query("SELECT * FROM urls WHERE \"shortUrl\" = $1", [shortUrl]);

        if(existingUrl.rowCount > 0) {
            const visitCountPlusOne = existingUrl.rows[0].visitCount + 1;
            await connection.query("UPDATE urls SET \"visitCount\" = $1 WHERE \"shortUrl\" = $2", [visitCountPlusOne, shortUrl]);
            
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

export async function deleteUrl(req, res) {
    try {
        const urlId = parseInt(req.params.id);
        const { user } = res.locals;

        const existingUrl = await connection.query("SELECT * FROM urls WHERE id = $1", [urlId]);
        if(existingUrl.rowCount === 0) return res.sendStatus(404);
        if(existingUrl.rows[0].userId !== user.id) return res.sendStatus(401);

        await connection.query("DELETE FROM urls WHERE id = $1", [urlId]);

        res.sendStatus(204);
    } catch (error) {
        console.log("Error deleting url.", error);
        res.status(500).send("Error deleting url.");
    }
}