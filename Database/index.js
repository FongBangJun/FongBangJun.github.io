/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

/**
 * @desc Set up SQLite database connection
 * @purpose Establish a connection to the SQLite database and enable foreign key constraints
 * @inputs Database file path './database.db'
 * @outputs Global database object 'db'
 */
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

/**
 * @desc Handle requests to the home page
 * @purpose Display a welcome message to the user
 * @inputs None
 * @outputs A "Hello World!" message sent to the client
 */
app.get('/', (req, res) => {
    res.send('Hello World!')
});

/**
 * @desc Add all the route handlers in usersRoutes to the app under the path /users
 * @purpose Organize user-related routes under a common prefix
 * @inputs Path prefix '/users' and the usersRoutes router
 * @outputs Routes registered with the express application
 */
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);


/**
 * @desc Start the web server and listen for HTTP requests
 * @purpose Begin accepting network connections on a specified port
 * @inputs Port number 3000
 * @outputs Server starts listening and logs status to console
 */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

