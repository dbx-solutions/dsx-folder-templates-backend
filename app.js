import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('DSX Folder Templates')
});

app.listen(8080);