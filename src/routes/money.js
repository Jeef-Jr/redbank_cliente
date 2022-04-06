const express = require("express");
const router = express.Router();
const mysql = require("../database/mysql_base").pool;
const assinture = require("./JwtAuthentication");

router.post("/", assinture, (req, res, next) => {
  mysql.query(
    "SELECT wallet, bank FROM vrp_user_moneys WHERE user_id = ?",
    [req.userId],
    (error, result, fields) => {
      let tamanho = result.length;

      if (tamanho > 0) {
        res.json({
          response: result[0],
        });
      } else {
        res.json({
          response: "Usuário não encontrado!",
        });
      }
    }
  );
});

router.patch("/", assinture, (req, res, next) => {
  const operacao = req.body.operacao;
  const valor = parseInt(req.body.valor);

  mysql.query(
    "SELECT wallet, bank FROM vrp_user_moneys WHERE user_id = ?",
    [req.userId],
    (error, result, fields) => {
      const wallet = parseInt(result[0].wallet);
      const bank = parseInt(result[0].bank);

      if (operacao === 1) {
        if (valor <= wallet && valor > 0) {
          const new_dep = parseInt(bank + valor);
          const new_wallet = parseInt(wallet - valor);

          mysql.query(
            "UPDATE vrp_user_moneys SET wallet = ?, bank = ? WHERE user_id = ?",
            [new_wallet, new_dep, req.userId],
            (error, result, fields) => {
              res.status(200).send({
                mensagem: "success",
              });
            }
          );
        } else {
          res.json({
            mensagem: "valor_insuficiente",
          });
        }
      } else if (operacao === 2) {
        if (valor <= bank && valor > 0) {
          const new_dep = parseInt(bank - valor);
          const new_wallet = parseInt(valor + wallet);

          mysql.query(
            "UPDATE vrp_user_moneys SET wallet = ?, bank = ? WHERE user_id = ?",
            [new_wallet, new_dep, req.userId],
            (error, result, fields) => {
              res.status(200).send({
                mensagem: "success",
              });
            }
          );
        } else {
          res.json({
            mensagem: "valor_insuficiente",
          });
        }
      } else if (operacao === 3) {
        const new_saldo = parseInt(bank - valor);

        mysql.query(
          "UPDATE vrp_user_moneys SET bank = ? WHERE user_id = ?",
          [new_saldo, req.userId],
          (error, result, fields) => {
            res.status(200).send({
              mensagem: "success",
            });
          }
        );
      } else if (operacao === 4) {
        const new_saldo = parseInt(bank + valor);

        mysql.query(
          "UPDATE vrp_user_moneys SET bank = ? WHERE user_id = ?",
          [new_saldo, req.userId],
          (error, result, fields) => {
            res.status(200).send({
              mensagem: "success",
            });
          }
        );
      } else if (operacao === 5) {
        if (valor <= bank) {
          const new_saldo = parseInt(bank - valor);

          mysql.query(
            "UPDATE vrp_user_moneys SET bank = ? WHERE user_id = ?",
            [new_saldo, req.userId],
            (error, result, fields) => {
              res.status(200).send({
                mensagem: "success",
              });
            }
          );
        } else {
          res.json({
            mensagem: "valor_insuficiente",
          });
        }
      }
    }
  );
});

router.post("/transferir", assinture, (req, res, next) => {
  const id_recebendo_pix = req.body.recebidor;
  const quantidade = parseInt(req.body.quantidade);

  mysql.query(
    "SELECT wallet, bank FROM vrp_user_moneys WHERE user_id = ?",
    [req.userId],
    (error, result, fields) => {
      let tamanho = result.length;

      if (tamanho > 0) {
        const bank = parseInt(result[0].bank);

        if (bank >= quantidade && quantidade > 0) {
          var new_valor = bank - quantidade;

          mysql.query(
            "SELECT wallet, bank FROM vrp_user_moneys WHERE user_id = ?",
            [id_recebendo_pix],
            (error, result2, fields) => {
              let tamanho = result2.length;

              if (tamanho > 0) {
                const recebidor_bank = result2[0].bank;
                var valor_recebidor = recebidor_bank + quantidade;
                mysql.query(
                  "UPDATE vrp_user_moneys SET bank = ? WHERE user_id = ?",
                  [new_valor, req.userId],
                  (error, result3, field) => {
                    mysql.query(
                      "UPDATE vrp_user_moneys SET bank = ? WHERE user_id = ?",
                      [valor_recebidor, id_recebendo_pix],
                      (error, result4, fields) => {
                        res.json({
                          response: "transfer_concluida",
                          user_envio: quantidade,
                          user_recebido: id_recebendo_pix,
                          saldo_enviador: new_valor,
                          saldo_recebidor: valor_recebidor,
                        });
                      }
                    );
                  }
                );
              } else {
                res.json({
                  response: "recebidor_inexistente",
                });
              }
            }
          );
        } else {
          res.json({
            response: "valor_insuficiente",
          });
        }
      }
    }
  );
});

router.post("/pagarmultas", assinture, (req, res, next) => {
  mysql.query(
    "SELECT D.dvalue, M.bank FROM vrp_user_data AS D INNER JOIN vrp_user_moneys AS M ON D.user_id = M.user_id WHERE D.dkey='vRP:multas' AND M.user_id = ?",
    [req.userId],
    (error, result, fields) => {
      let tamanho = result.length;

      if (tamanho > 0) {
        const bank = parseInt(result[0].bank);
        const apagar = parseInt(result[0].dvalue);

        if (bank >= apagar) {
          const newvalor = bank - apagar;

          mysql.query(
            "UPDATE vrp_user_data AS D INNER JOIN vrp_user_moneys AS M ON D.user_id = M.user_id SET D.dvalue = ?, M.bank = ? WHERE D.dkey = 'vRP:multas' AND M.user_id = ?",
            [0, newvalor, req.userId],
            (error, result1, fields) => {
              res.json({
                response: "success",
              });
            }
          );
        } else {
          res.json({
            response: "saldo_insuficiente",
          });
        }
      } else {
        res.json({
          mensagem: "user_inexistente",
        });
      }
    }
  );
});

module.exports = router;
