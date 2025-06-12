const express = require('express')
const pg = require('pg')
const app = express()
const axios = require('axios')
const pgvector = require('pgvector/pg')

//Using Embedding, Searching related words + Recommendation System
//postgreSQL Database, Node.js, OpenAI API Key needed

const client = new pg.Pool({
  host: 'DB Address',
  user: 'DB Username',
  password: 'DB Password',
  database: 'postgres', port: 5432, max: 5,
})

client.connect(err => {
  if (err) {
    console.log('DB Connection Error ' + err)
  } else {
    app.listen(8080, () => {
      console.log(`Server http://localhost:8080`)
    });
  }
})

app.get('/', (req, res) => {
  res.send('Main Page')
});

app.get('/add', async (req, res) => {
  var result = await axios.post('https://api.openai.com/v1/embeddings',
    {
      input: "Fresh new Chicken Sandwich",
      model: "text-embedding-3-small"
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + 'API Key'
      }
    })
    var text = 'INSERT INTO items (title, embedding) VALUES($1, $2)'
    var values = ['Fresh new Chicken Sandwich', pgvector.toSql(result.data.data[0].embedding)]
    await client.query(text, values)
    console.log(result.data.data[0].embedding)
  res.send('test')
});

app.get('/search', async (req, res) => {
  var result = await axios.post('https://api.openai.com/v1/embeddings',
    {
      input: req.query.q,
      model: "text-embedding-3-small"
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + 'OPENAI의API키'
      }
    })
    var text = `SELECT id, title, 1 - (embedding <=> $1) as similarity
    FROM items`
    var values = [pgvector.toSql(result.data.data[0].embedding)]
    var rank = await client.query(text, values)
    res.send(rank.rows)
});




