import express from 'express';
import env from 'dotenv';
import { db } from '../db';

env.config();
const app = express();

// Express middleware
// Built in express.json middleware
app.use(express.json());

// GET all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM RESTAURANTS', []);
    res.status(200).send({
      status: 'success',
      count: result.rows.length,
      data: {
        restaurants: result.rows,
      },
    });
  } catch (e) {
    console.log(e);
  }
});

// GET a select restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
  // parameterized querying, protection against SQL injection attacks
  try {
    const result = await db.query('SELECT * FROM RESTAURANTS WHERE ID=$1', [
      req.params.id,
    ]);
    res.status(200).send({
      status: 'success',
      count: result.rows.length,
      data: {
        restaurant: result.rows[0],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

// POST a restaurant (CREATE)
app.post('/api/v1/restaurants', async (req, res) => {
  // parameterized querying, protection against SQL injection attacks
  try {
    const result = await db.query(
      'INSERT INTO RESTAURANTS (name, location, price_range) values ($1, $2, $3) returning *',
      [req.body.name, req.body.location, req.body.price_range],
    );
    res.status(201).send({
      status: 'success',
      data: result.rows[0],
    });
  } catch (e) {
    console.log(e);
  }
});

// UPDATE restaurant
app.put('/api/v1/restaurants/:id', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE RESTAURANTS SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *',
      [req.body.name, req.body.location, req.body.price_range, req.params.id],
    );
    res.status(200).send({
      status: 'success',
      data: result.rows[0],
    });
  } catch (e) {
    console.log(e);
  }
});

// DELETE restaurant
app.delete('/api/v1/restaurants/:id', async (req, res) => {
  const result = await db.query('DELETE FROM RESTAURANTS WHERE id = $1', [
    req.params.id,
  ]);
  res.status(204).send({
    status: 'success',
    data: null,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`express app is listening on port ${port}...`);
});
