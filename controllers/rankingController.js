import urlsRepositories from "../repositories/urlsRepositories.js";
import usersRepositories from "../repositories/usersRepositories.js";

export async function getRanking(req, res) {
    try {
        const users = await usersRepositories.getAllUsers();
        const rankingPartial = await urlsRepositories.getRanking();
        let rankingComplete = [...rankingPartial.rows];

        if(users.rowCount < 10) {
            rankingComplete.forEach((element, index) => {
                rankingComplete[index].linksCount = parseInt(rankingComplete[index].linksCount);
                rankingComplete[index].visitCount = parseInt(rankingComplete[index].visitCount);
            });
            users.rows.forEach(element1 => {
                const aux = rankingPartial.rows.find(element2 => element2.id === element1.id);
                if(!aux) rankingComplete.push({id: element1.id, name: element1.name, linksCount: 0, visitCount: 0});
            });

            res.status(200).send(rankingComplete);
        }
        else {
            const aux1 = 10 - rankingPartial.rowCount;

            rankingComplete.forEach((element, index) => {
                rankingComplete[index].linksCount = parseInt(rankingComplete[index].linksCount);
                rankingComplete[index].visitCount = parseInt(rankingComplete[index].visitCount);
            });

            while(aux1 > 0) {
                const aux2 = rankingPartial.rows.find(element => element.id === users.rows[aux1].id);
                if(!aux2) {
                    rankingComplete.push({id: users.rows[aux1].id, name: users.rows[aux1].name, linksCount: 0, visitCount: 0});
                    aux2--;
                }
            };

            res.status(200).send(rankingComplete);
        }
    } catch (error) {
        console.log("Error recovering ranking.", error);
        res.status(500).send("Error recovering ranking.");
    }
}