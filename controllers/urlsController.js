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

export async function getUserUrls(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const { user } = res.locals;

        const existingUser = await connection.query("SELECT * FROM users WHERE id = $1", [userId]);
        if(existingUser.rowCount === 0) return res.sendStatus(404);
        if(userId !== user.id) return res.sendStatus(401);

        const urls = await connection.query("SELECT * FROM urls WHERE \"userId\" = $1", [userId]);

        let visitCountSum = 0;
        const urlsAux = urls.rows.map(element => {
            const {id, url, shortUrl, visitCount} = element;
            visitCountSum += visitCount;

            return ({id, shortUrl, url, visitCount});
        });

        const resBody = {
            id: userId,
            name: user.name,
            visitCount: visitCountSum,
            shortenedUrls: urlsAux
        };

        res.status(200).send(resBody);
    } catch (error) {
        console.log("Error recovering user urls.", error);
        res.status(500).send("Error recovering user urls.");
    }
}