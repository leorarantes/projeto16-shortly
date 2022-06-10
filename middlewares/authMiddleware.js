import sessionsRepositories from "../repositories/sessionsRepositories.js";
import usersRepositories from "../repositories/usersRepositories.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.status(401).send("No token.");

    try {
        const session = await sessionsRepositories.getSession(token);

        if(session.rowCount === 0) return res.status(401).send("No session.");

        const now = parseFloat((Date.now()/60000).toFixed(1));
        const timeDifference = now - session.rows[0].lastStatus;
        if (timeDifference > 60) {
            await sessionsRepositories.deleteSessions(session.rows[0].userId);
            return res.status(401).send("Session expired.");
        }

        const user = await usersRepositories.getUser({ userId: session.rows[0].userId })
        if (user.rowCount === 0) return res.sendStatus(400);

        await sessionsRepositories.updateSessions(session.rows[0].id);

        res.locals.user = user.rows[0];

        next();
    } catch (error) {
        console.log("token", error);
        res.status(500).send("Error checking token.");
    }
}