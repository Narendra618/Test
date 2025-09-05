 const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json()); // ✅ To parse JSON request body

const url = 'mongodb://localhost:27017';
const dbName = 'myDatabase';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // ✅ POST route to add user at runtime
    app.post('/add-user', async (req, res) => {
      const { name, age } = req.body; // get data from request body

      if (!name || !age) {
        return res.status(400).json({ message: 'Name and age are required' });
      }

      const result = await db.collection('users').insertOne({ name, age });
      res.send(`✅ User inserted with ID: ${result.insertedId}`);
    });

    // ✅ GET route to get all users
    app.get('/users', async (req, res) => {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    });

    app.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
