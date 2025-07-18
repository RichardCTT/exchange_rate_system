const express = require('express');
const app = express();
const convertRouter = require('./routes/convert');

app.use('/api/convert', convertRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
