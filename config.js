var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rgs_practice'
});
connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected ...");
  } else {
    console.log(err);
  }
});

module.exports = connection;