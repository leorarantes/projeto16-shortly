import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import { authSignInSchema, authSignUpSchema } from "../schemas/authSchema.js";
import usersRepositories from "../repositories/usersRepositories.js";
import sessionsRepositories from "../repositories/sessionsRepositories.js";

export async function signUp(req, res) {
    const { error } = authSignUpSchema.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        const {name, email, password} = req.body;

        const existingUser = await usersRepositories.getUser({ email })
        if(existingUser.rowCount > 0) return res.status(409).send("User already exists.");

        const SALT = 14;
        await usersRepositories.insertUser(name, email, bcrypt.hashSync(password, SALT));

        res.sendStatus(201);
    } catch (error) {
        console.log("Error creating user.", error);
        res.status(500).send("Error creating user.");
    }
}

export async function signIn(req, res) {
    const { error } = authSignInSchema.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        const {email, password} = req.body;

        const existingUser = await usersRepositories.getUser({ email })
        if (existingUser.rowCount === 0) return res.sendStatus(401);
        if (existingUser.rowCount > 0 && bcrypt.compareSync(password, existingUser.rows[0].password)) {
            const token = uuid();
            await sessionsRepositories.insertSession(existingUser.rows[0].id, token);
            
            res.status(200).send({token});
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.log("Error logging in user.", error);
        res.status(500).send("Error logging in user.");
    }
}