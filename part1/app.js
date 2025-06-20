var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var port = 8080;

var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: ' DogWalkService'
};

async function ini(params) {
    var initialConnection = await mysql.createConnection(dbConfig);
    console.log("Connected to mySQL database");

    try {
        var schema_sql = fs.readFileSync(path.join(__dirname, 'dogwalks.sql'), 'utf8');
        var schema_statement = schema_sql.split(/;\s*/m);

        for (var statement of schema_statement) {
            if (statement.trim().length > 0) {
                await initialConnection.query(statement);
            }
        }
        console.log('Database created successfully');
    }
    catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    } finally {
        initialConnection.end();
    }
}

// 
let

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
