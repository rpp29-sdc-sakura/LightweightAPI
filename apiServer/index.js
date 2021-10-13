const express = require('express');
const bodyParser = require('body-parser');
const { getParser } = require('./middleware.js');
const db = require('./databaseHelpers/postgresHelper.js');

const app = express();
const PORT = 7778;
app.listen(PORT, () => { console.log(`API server now listening on port ${PORT}...`); });

app.use(bodyParser.json())
app.use(getParser);

app.get('/', (req, res) => {
  // console.log('body recieved: ', JSON.stringify(req.body));
  db.getIds(req.body.productId)
    .then((result) => {
      console.log('retrieval successful');
      res.status(200).send(result.rows[0].relatedids);
    })
    .catch((err) => {
      console.log('retrieval failed\n', err)
      res.status(500).end();
    });
});

app.put('/upsert', (req, res) => {
  console.log('\nPUT RECIEVED\n', req.body.params);
  db.upsert(req.body.params)
    .then((results) => {
      console.log('upsert sucessful\n', results);
      res.status(results.command === 'UPDATE' ? 200 : 201).end();
    })
    .catch((err) => {
      console.log('upsert failed\n', err);
      res.status(500).end();
    });
});