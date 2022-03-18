const express = require("express");
const router = express.Router();
const mysql = require("../database/mysql").pool;

router.get("/", (req, res, next) => {
  mysql.query("SELECT `token` FROM config", (error, result, fields) => {
    if (error) {
      res.json({
        mensagem: "Erro na conexão com o banco de dados ou tabela.",
      });
    }

    res.status(200).send((response = result));
  });
});

module.exports = router;
