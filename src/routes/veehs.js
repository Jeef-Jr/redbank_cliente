const express = require("express");
const router = express.Router();
const mysql = require("../database/mysql_base").pool;
const assinature = require("./JwtAuthentication");

router.post("/debveehs", assinature, (req, res, next) => {
  if (req.userId != null) {
    mysql.query(
      "SELECT dvalue FROM vrp_user_data WHERE dkey = 'vRP:multas' AND user_id = ?",
      [req.userId],
      (error, result, fields) => {
        let tamanho = result.length;

        if (tamanho > 0) {
          const multas = parseInt(result[0].dvalue);
          res.json({
            response: multas,
          });
        } else {
          res.json({
            response: "pendencias_inexistentes",
          });
        }
      }
    );
  }
});

router.post("/myveehs", assinature, (req, res, next) => {
  const id = req.userId;

  mysql.query(
    "SELECT * FROM vrp_user_vehicles WHERE user_id = ? ORDER BY vehicle",
    [id],
    (error, result, fields) => {
      let tamanho = result.length;

      if (tamanho > 0) {
        res.status(201).json({
          response: result,
        });
      } else {
        res.json({
          response: "not_found_vehs",
        });
      }
    }
  );
});

router.post("/veryveh", assinature, (req, res, next) => {
  const id = req.userId;
  const veiculo = req.body.veiculo;

  mysql.query(
    "SELECT vehicle FROM vrp_user_vehicles WHERE user_id = ? AND vehicle = ?",
    [id, veiculo],
    (error, result, fields) => {
      let tamanho = result.length;

      if (tamanho > 0) {
        res.json({
          response: "success",
        });
      } else {
        res.json({
          response: "i_not",
        });
      }
    }
  );
});

router.post("/myveh", assinature, (req, res, next) => {
  const id = req.userId;
  const veiculo = req.body.veiculo;

  mysql.query(
    "SELECT * FROM vrp_user_vehicles WHERE user_id = ? AND vehicle = ?",
    [id, veiculo],
    (error, result, fields) => {
      let tamanho = result.length;

      const detido = result[0].detido;

      res.json({
        res: "success",
        detido,
      });

      if (tamanho > 0) {
      } else {
        res.json({
          response: "i_not",
        });
      }
    }
  );
});

router.post("/desblock", assinature, (req, res, next) => {
  const id = req.userId;
  const veiculo = req.body.veiculo;

  mysql.query(
    "UPDATE vrp_user_vehicles SET detido = ? WHERE user_id = ? AND vehicle = ?",
    [0, id, veiculo],
    (error, result, fields) => {
      if (error) {
        res.status(404).send({
          res: "error",
        });
      }

      res.json({
        res: "success",
      });
    }
  );
});

module.exports = router;
