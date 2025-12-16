const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRouter = require("./routes/auth.routes");
const techHubRouter = require('./routes/techhub.routes');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Standard middleware for parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to EVEN API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/hubs", techHubRouter);

module.exports = { app };