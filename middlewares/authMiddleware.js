import connection from "../database.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("No token.");

    try {
        const sessions = await connection.query("SELECT * FROM sessions");
        const session = sessions.rows.find(element => element.token === token);

        if (!session) return res.status(401).send("No session.");

        const timeDifference = parseFloat((Date.now()/60000).toFixed(1)) - session.createdAt;
        if (timeDifference > 60) {
            await connection.query("DELETE FROM sessions where \"userId\" = $1", [session.userId]);
            return res.status(401).send("Session expired.");
        }

        const user = await connection.query("SELECT * FROM users WHERE id = $1", [session.userId]);
        if (!user) return res.sendStatus(400);

        res.locals.user = user.rows[0];

        next();
    } catch (error) {
        console.log("token", error);
        res.status(500).send("Error checking token.");
    }
}