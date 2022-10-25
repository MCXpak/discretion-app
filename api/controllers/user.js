const bcrypt = require('bcrypt');

const User = require('../models/user');
const Token = require('../models/token');

async function register (req, res) {
    try {
        const data = req.body;

        // Generate a salt with a specific cost
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));

        // Hash the password
        data["password"] = await bcrypt.hash(data["password"], salt);

        console.log(salt, data["password"])

        const result = await User.create(data);
        res.status(201).send(result);
    } catch (err) {
        res.status(400).json({"error": err.message})
    }
};

async function show (req, res) {
    try {
        const id = parseInt(req.params.id);
        const user = await User.getOneById(id);
        res.json(user);
    } catch (err) {
        res.status(404).json({"error": err.message})
    }
};

async function login (req, res) {
    try {
        const user = await User.getOneByUsername(req.body.username);

        const authenticated = await bcrypt.compare(req.body.password, user["password"]);

        if (!authenticated) {
            throw new Error("Incorrect credentials.");
        } else {

            const token = await Token.create(user["id"]);
            res.cookie("discretionUser", token.token, { maxAge: 3600000, sameSite: 'None', secure: true })
            console.log("this is at user: ", token.token)

            res.status(200).json({ authenticated: true, token: token });
        }
    } catch (err) {
        res.status(403).json({"error": err.message})
    }
}

function logout(req, res) {

    res.clearCookie("discretionUser");
    res.status(204).end();

}

module.exports = {
    register, show, login, logout
}
