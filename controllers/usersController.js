import usersRepositories from "../repositories/usersRepositories.js";
import urlsRepositories from "../repositories/urlsRepositories.js";

export async function getUserUrls(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const { user } = res.locals;

        const existingUser = await usersRepositories.getUser({ userId });
        if(existingUser.rowCount === 0) return res.sendStatus(404);
        if(userId !== user.id) return res.sendStatus(401);

        const urls = await urlsRepositories.getUrl({ userId });
        const visitCountSum = await usersRepositories.getVisitCountSum(userId);
        let visitCount = 0;
        if(visitCountSum.rowCount > 0) visitCount = visitCountSum.rows[0].sum;

        const resBody = {
            id: userId,
            name: user.name,
            visitCount,
            shortenedUrls: urls.rows
        };

        res.status(200).send(resBody);
    } catch (error) {
        console.log("Error recovering user urls.", error);
        res.status(500).send("Error recovering user urls.");
    }
}