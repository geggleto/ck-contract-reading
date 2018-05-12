const mysql      = require('mysql');
const env = require('node-env-file');

env(__dirname + '/../.env');

let connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USERNAME,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});

connection.connect();

module.exports.db = connection;