var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var port = 8080;

let db;
// Initialize the database connection
var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: ' DogWalkService'
};

// Check if the database exists, if not, create it
async function initializeDatabase() {
    var initialConnection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password
    });
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

        await initialConnection.changeUser({ database: dbConfig.database });
        var insert_sql = fs.readFileSync(path.join(__dirname, 'task1-5.sql'), 'utf8');
        var insert_statement = insert_sql.split(/;\s*/m);
        for (var insert of insert_statement) {
            if (insert.trim().length > 0) {
                await initialConnection.query(insert);
            }
        }
        console.log('Data inserted successfully');

        await initialConnection.end();

        db = await mysql.createPool(dbConfig);
        console.log('Database connection pool created');
    }
    catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
}

// API Routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/dogs', async (req, res) => {
    try {
        var get_dog_query = `
        SELECT
            d.name AS dog_name,
            d.size,
            u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id;
        `;
        var [rows] = await db.query(get_dog_query);
        res.json(rows);
    } catch (error) {
        console.error('Failed to get dogs list:', error);
        res.status(500).json({ error: 'Failed to get dogs list data' });
    }
});

app.get('/api/walkrequests/open', async (req, res) => {
    try {
        var get_open_requests_query = `
        SELECT
            wr.request_id,
            d.name AS dog_name,
            wr.requested_time,
            wr.duration_minutes,
            wr.location,
            u.username AS owner_username
        FROM WalkRequests wr
        JOIN Dogs d ON wr.dog_id = d.dog_id
        JOIN Users u ON d.owner_id = u.user_id
        WHERE wr.status = 'open';
        `;
        var [rows] = await db.query(get_open_requests_query);
        res.json(rows);
    } catch (error) {
        console.error('Failed to get open walk requests:', error);
        res.status(500).json({ error: 'Failed to get open walk requests data' });
    }
});



module.exports = app;
