import { nanoid } from 'nanoid';

import connection from "../database.js";
import { urlSchema } from "../schemas/urlSchema.js";

export async function shortenUrl(req, res) {
    const { error } = urlSchema.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        const { user } = res.locals;
        const existingUrl = await connection.query("SELECT * FROM urls WHERE \"userId\" = $1 AND \"originalUrl\" = $2", [user.id, req.body.url]);
        if(existingUrl.rowCount > 0) {
            res.status(201).send({shortUrl: existingUrl.rows[0].shortUrl});
        }
        else {
            const shortUrl = nanoid();
            await connection.query("INSERT INTO urls (\"userId\", \"originalUrl\", \"shortUrl\") VALUES ($1, $2, $3)", [user.id, req.body.url, shortUrl]);

            res.status(201).send({shortUrl});
        }
    } catch (error) {
        console.log("Error shortening url.", error);
        res.status(500).send("Error shortening url.");
    }
}