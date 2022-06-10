import connection from "../database.js";

async function getUrl(params) {
    const { userId, url, shortUrl, urlId } = params;
    
    if(shortUrl) return connection.query("SELECT * FROM urls WHERE \"shortUrl\" = $1", [shortUrl]);
    if(urlId) return connection.query("SELECT * FROM urls WHERE id = $1", [urlId]);
    if(userId && url) return connection.query("SELECT * FROM urls WHERE \"userId\" = $1 AND url = $2", [userId, url]);
    return connection.query("SELECT * FROM urls WHERE \"userId\" = $1", [userId]);
}

async function insertUrl(userId, url, shortUrl) {
	return connection.query("INSERT INTO urls (\"userId\", url, \"shortUrl\") VALUES ($1, $2, $3)", [userId, url, shortUrl]);
}

async function updateVisitCount(visitCountPlusOne, shortUrl) {
	return connection.query("UPDATE urls SET \"visitCount\" = $1 WHERE \"shortUrl\" = $2", [visitCountPlusOne, shortUrl]);
}

async function deleteUrl(urlId) {
	return connection.query("DELETE FROM urls WHERE id = $1", [urlId]);
}

async function getRanking() {
	return connection.query("SELECT users.id, users.name, COUNT(urls.id) AS \"linksCount\", SUM(urls.\"visitCount\") AS \"visitCount\" FROM urls JOIN users ON urls.\"userId\" = users.id GROUP BY users.id ORDER BY SUM(urls.\"visitCount\") DESC LIMIT 10");
}

export const urlsRepositories = {
	getUrl,
    insertUrl,
    updateVisitCount,
    deleteUrl,
    getRanking
}

export default urlsRepositories;