import connection from "../database.js";

async function getSession(token) {
    return connection.query("SELECT * FROM sessions WHERE token = $1", [token]);
}

async function insertSession(userId, token) {
	const now = parseFloat((Date.now()/60000).toFixed(1));
    return connection.query("INSERT INTO sessions (\"userId\", token, \"lastStatus\") VALUES ($1, $2, $3)", [userId, token, now]);
}

async function updateSessions(sessionId) {
    const now = parseFloat((Date.now()/60000).toFixed(1));
    return connection.query("UPDATE sessions SET \"lastStatus\" = $1 WHERE id = $2", [now, sessionId]);
}

async function deleteSessions(userId) {
    return connection.query("DELETE FROM sessions WHERE \"userId\" = $1", [userId]);
}

export const sessionsRepositories = {
    getSession,
	insertSession,
    updateSessions,
    deleteSessions
}

export default sessionsRepositories;