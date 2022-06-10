import connection from "../database.js";

async function getAllUsers() {
	return connection.query("SELECT * FROM users LIMIT 10");
}

async function getUser(params) {
	const { userId, email } = params;

	if(userId) return connection.query("SELECT * FROM users WHERE id = $1", [userId]);
	return connection.query("SELECT * FROM users WHERE email = $1", [email]);
}

async function getVisitCountSum(userId) {
	return connection.query("SELECT SUM(urls.\"visitCount\") FROM urls WHERE \"userId\" = $1 GROUP BY urls.\"userId\"", [userId]);
}

async function insertUser(name, email, password) {
	return connection.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password]);
}

export const urlsRepositories = {
	getAllUsers,
	getUser,
    getVisitCountSum,
	insertUser
}

export default urlsRepositories;