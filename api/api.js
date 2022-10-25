const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const logRoutes = require('./middleware/logger');
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');

const api = express();

api.use(cors({ origin: true, credentials: true }));// credentials: true allows the server to send and receive cookies, origin: true is needed when credentials is set to true
api.use(express.json());
api.use(cookieParser());
api.use(logRoutes);

api.get("/", (req, res) => {
    res.json({
        name: "Discretion",
        description: "Send and receive private messages."
    })
})

api.use("/posts", postRouter);
api.use("/users", userRouter);

module.exports = api;
