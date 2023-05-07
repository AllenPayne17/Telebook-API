const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
  name: String,
  contactNumber: String,
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
    // Redirect to the static success.html page
    res.redirect('/success.html');
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

app.listen(3000, () => console.log('Server running on port 3000'));
