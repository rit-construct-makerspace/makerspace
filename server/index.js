const express = require('express');
require('dotenv').config({ path: '../process.env' });
const Pool = require("pg").Pool;

const pool = new Pool({
user: process.env.USERNAME,
host: process.env.HOSTNAME,
database: process.env.DATABASE,
password: process.env.PASSWORD,
port: process.env.PORTNUMBER,
})

pool.query("CREATE TABLE IF NOT EXISTS students(uid SERIAL PRIMARY KEY, "
    + " firstName VARCHAR(20), lastName VARCHAR(20), email VARCHAR(15) UNIQUE, year INTEGER, "
    + " major TEXT, college TEXT, registrationDate DATE DEFAULT CURRENT_DATE, balance MONEY, hold BOOLEAN DEFAULT FALSE);", (err, res) => {
    console.log(err, res);
    pool.query(
        "INSERT INTO students(uid, firstName, lastName, email, year, major, college, balance) " +
        " VALUES(640000338, 'Lorem', 'Ipsum', 'li7708@rit.edu', 4, 'Software Engineering', " +
        " 'Golisano College of Computing and Information Sciences', 0.00)",
        (err, res) => {
            console.log(err, res);
        }
        );
});


const getStudents = (request, response) => {
pool.query('SELECT * FROM students ORDER BY uid ASC', (error, results) => {
    if (error) {
    throw error
    }
    response.status(200).json(results.rows)
})
}

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (request, response) => {
response.json({ info: 'This is our empty homepage.'})
})

app.get('/users', getStudents)

app.listen(port, () => {
console.log(`App running on port ${port}.`)
})