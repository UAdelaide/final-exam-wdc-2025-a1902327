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
    }
    catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    } finally {
        initialConnection.end();
    }
}

// API Routes
let db;

app.get('/api/dogs', async (req, res) => {
    try {
        var sql = `
        SELECT
            d.name AS dog_name,
            d.size,
            u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id;
        `;
        var [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Failed to get dogs list:', error);
        res.status(500).json({ error: 'Failed to get dogs list data' });
    }
    });



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

async function startApp() {
    await initializeDatabase();
    db = await mysql.createConnection(dbConfig);
    console.log(`Connected to database '${dbConfig.database}'.`);

    app.listen(port, () => {
        console.log('Server is running on http://localhost:' + port);
        console.log('API endpoints are avaliable:');
        console.log('GET /api/dogs');
    });
}

startApp();

module.exports = app;
