const express = require("express");
const router = express.Router();
const mysql = require("../database/mysql_base").pool;

router.post("/", (req, res, next) => {
  const iduser = req.body.iduser;
  const rg = req.body.rg;

  mysql.query(
    "SELECT user_id, registration FROM vrp_user_identities WHERE user_id = ? AND registration = ?",
    [iduser, rg],
    (error, result, fields) => {
      if (error) {
        res.status(404).send({
          mensagem: "campos_invalidos",
        });
      }
      let tamanho = result.length;

      if (tamanho === 1) {
        res.json({
          mensagem: "success",
        });
      } else {
        res.json({
          mensagem: "Inc",
        });
      }
    }
  );
});

module.exports = router;
