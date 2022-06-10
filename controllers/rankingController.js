import connection from "../database.js";

export async function getRanking(req, res) {
    try {
        const ranking = await connection.query("SELECT users.id, users.name, COUNT(urls.id) AS \"linksCount\", SUM(urls.\"visitCount\") AS \"visitCount\" FROM urls JOIN users ON urls.\"userId\" = users.id GROUP BY users.id ORDER BY SUM(urls.\"visitCount\") DESC");
        res.status(200).send(ranking.rows);
    } catch (error) {
        console.log("Error recovering ranking.", error);
        res.status(500).send("Error recovering ranking.");
    }
}