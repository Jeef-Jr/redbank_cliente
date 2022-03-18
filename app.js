const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const rotaConfig = require("./src/routes/config");
const rotaId = require("./src/routes/identidade");
const rotaMoney = require("./src/routes/money");
const rotaDebVehs = require("./src/routes/veehs");

app.use("/config", rotaConfig);
app.use("/id", rotaId);
app.use("/money", rotaMoney);
app.use("/veehs", rotaDebVehs);

module.exports = app;
