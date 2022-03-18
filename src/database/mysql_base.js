const mysql = require("mysql");

var pool = mysql.createConnection({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_SERVER,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
});

exports.pool = pool;
