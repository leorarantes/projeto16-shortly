import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import { authSignInSchema, authSignUpSchema } from "../schemas/authSchema.js";
import connection from "../database.js";

export async function signUp(req, res) {
    const { error } = authSignUpSchema.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        const {name, email, password} = req.body;

        const existingUser = await connection.query("SELECT * FROM users WHERE email = $1", [email]);
        if(existingUser.rowCount > 0) return res.status(409).send("User already exists.");

        const SALT = 14;
        await connection.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, bcrypt.hashSync(password, SALT)]);

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

        const users = await connection.query("SELECT * FROM users");
        const user = users.rows.find(element => element.email === email);

        if (!user) return res.sendStatus(401);
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            const createdAt = parseFloat((Date.now()/60000).toFixed(1));
            await connection.query("INSERT INTO sessions (\"userId\", token, \"createdAt\") VALUES ($1, $2, $3)", [user.id, token, createdAt]);
            
            res.status(200).send({token});
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.log("Error logging in user.", error);
        res.status(500).send("Error logging in user.");
    }
}