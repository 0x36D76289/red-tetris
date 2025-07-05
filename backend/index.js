const { logWarning } = require('./logs.js');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Red Tetris Backend!');
});

app.listen(PORT, () => {
  logWarning(`Server is running on http://localhost:${PORT}`);
});
