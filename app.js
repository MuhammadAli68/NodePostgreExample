const express = require('express');
const { Pool } = require('pg'); // Import the pg module

const app = express();
const port = 3000;

// Set up a connection pool
const pool = new Pool({
  user: 'myuser',
  host: 'db', // Use the service name defined in docker-compose.yml
  database: 'mydb',
  password: 'S0me!P@sswD1',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/new-feature', async (req, res) => {
  try {
    // Fetch data from the sample_table
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM myschema.students');
    const data = result.rows;
    client.release();

    // Render HTML page with data
    res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="./public/styles.css">
        </head>
        <body>
          <h1>New Feature Page</h1>
          <ul>
            ${data.map(row => `<li>${row.student_id}: ${row.first_name}: ${row.last_name}: ${row.homeroom_number}: ${row.phone}: ${row.email}: ${row.graduation_year}</li>`).join('')}
          </ul>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
