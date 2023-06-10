const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const importedData = [];

app.get('/api/imported-data', (req, res) => {
  res.json(importedData);
});

app.post('/api/imported-data', (req, res) => {
  const data = req.body;
  // Assuming the request body contains an array of imported data
  importedData.length = 0; // Clear the existing imported data
  importedData.push(...data); // Replace with the new imported data
  res.sendStatus(200);
});

app.delete('/api/imported-data/:id', (req, res) => {
  const { id } = req.params;
  const index = importedData.findIndex((data) => data.id === Number(id));
  if (index !== -1) {
    importedData.splice(index, 1); // Remove the specific row from imported data
    res.sendStatus(200);
  } else {
    res.sendStatus(404); // Row not found
  }
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
