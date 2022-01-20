// import database

const { Pool } = require("pg");

// setup connect pool
const dbPoll = new Pool({
  database: "web_personal_danu",
  port: 5432,
  user: "postgres",
  password: "danu1998",
});

module.exports = dbPoll;
