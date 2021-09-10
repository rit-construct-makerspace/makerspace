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

const getUsers = (request, response) => {
    pool.query('SELECT * FROM students ORDER BY id ASC', (error, results) => {
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
  
app.get('/users', getUsers)

app.listen(port, () => {
console.log(`App running on port ${port}.`)
})