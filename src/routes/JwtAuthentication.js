
const jwt = require("jsonwebtoken");
const assinature = "redygital.com";

function verifyJWT(req, res, next) {
    var token = req.body.token;
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "token_not_information." });
  
    jwt.verify(token, assinature, function (err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, response: "token_invalido." });
  
      req.userId = decoded.iduser;
      next();
    });
  }

  module.exports = verifyJWT;