const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
  name: String,
  contactNumber: Number,
  email: String,
  date: Date,
});

const Registration = mongoose.model('Registration', registrationSchema);

app.post('/register', async (req, res) => {
  const registration = new Registration({
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    date: req.body.date,
  });

  try {
    await registration.save();
    res.status(201).send('Registration successful');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.get('/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).send('Error fetching registrations');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));
