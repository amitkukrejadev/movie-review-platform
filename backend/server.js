require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// mount placeholder routes
app.use('/api/movies', require('./routes/movies'));

// health
app.get('/', (req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
