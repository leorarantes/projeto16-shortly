import connection from "../database.js";

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