import connection from "../database.js";

export async function getUserUrls(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const { user } = res.locals;

        const existingUser = await connection.query("SELECT * FROM users WHERE id = $1", [userId]);
        if(existingUser.rowCount === 0) return res.sendStatus(404);
        if(userId !== user.id) return res.sendStatus(401);

        const urls = await connection.query("SELECT * FROM urls WHERE \"userId\" = $1", [userId]);
        const visitCountSum = await connection.query("SELECT SUM(urls.\"visitCount\") FROM urls WHERE \"userId\" = $1 GROUP BY urls.\"userId\"", [userId]);

        const resBody = {
            id: userId,
            name: user.name,
            visitCount: parseInt(visitCountSum.rows[0].sum),
            shortenedUrls: urls.rows
        };

        res.status(200).send(resBody);
    } catch (error) {
        console.log("Error recovering user urls.", error);
        res.status(500).send("Error recovering user urls.");
    }
}