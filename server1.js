const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Connect to the MySQL database
const sequelize = new Sequelize('task','root','1234',  {
  host: 'localhost',
  dialect: 'mariadb',
});
// Define the model for the imported data
const ImportedData = sequelize.define('ImportedData', {
  itemNo: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync();

// Create routes for CRUD operations
app.get('/api/imported-data', async (req, res) => {
  try {
    const importedData = await ImportedData.findAll();
    res.json(importedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/*app.post('/api/imported-data', async (req, res) => {
  try {
    const data = req.body;
    await ImportedData.destroy({ truncate: true });
    await ImportedData.bulkCreate(data);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});*/

app.post('/api/imported-data',upload.single('file'),async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(data);
    // Process the data as needed (e.g., save to the database, perform validations, etc.)
    
    const importedData = data.map(row => ({
      itemNo: row[0],
      description: row[1],
      rate: parseFloat(row[2]),
      qty: parseInt(row[3]),
      amount: parseFloat(row[4]),
    }));
    //console.log("helllo"+importedData)
    await ImportedData.destroy({ truncate: true });
    await ImportedData.bulkCreate(importedData);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.put('/api/imported-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    await ImportedData.update(updatedData, { where: { id } });
    
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/api/imported-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await ImportedData.destroy({ where: { id } });
    if (deletedRowCount > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
