const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'signup.html'));
});

app.get('/signup-medical', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'signupmedical.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'profile.html'));
});

app.get('/services-catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'servicescatalog.html'));
});

app.get('/services-offered', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'servicesoffered.html'));
});

app.get('/appointments', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'appointments.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/get-profile', (req, res) => {
  const accountId = req.session.accountId;
  if (!accountId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  db.get('SELECT * FROM User JOIN Account ON User.AccountID = Account.AccountID WHERE User.AccountID = ?', [accountId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve profile' });
    } else {
      res.json({
        name: row.Name,
        dob: row.DOB,
        email: row.Email,
        address: row.Address,
        contactNumber: row.ContactNumber,
        city: row.City,
        state: row.State
      });
    }
  });
});

// Handle login form submission
app.post('/', (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt with email: ${email} and password: ${password}`);
  db.get('SELECT * FROM Account WHERE Email = ? AND Password = ?', [email, password], (err, account) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (account) {
      console.log('Login successful');
      req.session.accountId = account.AccountID;
      res.redirect('/services-catalog');
    } else {
      console.log('Login failed');
      res.redirect('/');
    }
  });
});

// Handle signup form submission
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(`Signup attempt with email: ${email}`);
  db.run('INSERT INTO Account (Email, Password, IsMedicalProvider) VALUES (?, ?, ?)', [email, password, 0], function (err) {
    if (err) {
      console.error(err);
      res.redirect('/signup');
    } else {
      const accountId = this.lastID;
      db.run('INSERT INTO User (AccountID, Name) VALUES (?, ?)', [accountId, name], function (err) {
        if (err) {
          console.error(err);
          res.redirect('/signup');
        } else {
          console.log('Signup successful');
          req.session.accountId = accountId;
          res.redirect('/services-catalog');
        }
      });
    }
  });
});

// Handle medical professional signup form submission
app.post('/signup-medical', (req, res) => {
  const { name, email, password, certificate } = req.body;
  console.log(`Medical signup attempt with email: ${email}`);
  db.run('INSERT INTO Account (Email, Password, IsMedicalProvider) VALUES (?, ?, ?)', [email, password, 1], function (err) {
    if (err) {
      console.error(err);
      res.redirect('/signup-medical');
    } else {
      const accountId = this.lastID;
      db.run('INSERT INTO MedicalProvider (AccountID, Certificate, IsAuthenticated) VALUES (?, ?, ?)', [accountId, certificate, 0], function (err) {
        if (err) {
          console.error(err);
          res.redirect('/signup-medical');
        } else {
          console.log('Medical signup successful');
          req.session.accountId = accountId;
          res.redirect('/services-catalog');
        }
      });
    }
  });
});

// Handle profile update
app.post('/update-profile', (req, res) => {
  const { name, email, address, contactNumber, city, state } = req.body;
  const accountId = req.session.accountId;
  if (!accountId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log(`Updating profile for account ID: ${accountId}`);
  db.run('UPDATE User SET Name = ?, Address = ?, ContactNumber = ?, City = ?, State = ? WHERE AccountID = ?',
    [name, address, contactNumber, city, state, accountId], function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
      } else {
        db.run('UPDATE Account SET Email = ? WHERE AccountID = ?', [email, accountId], function (err) {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update email' });
          } else {
            res.json({ success: 'Profile updated successfully' });
          }
        });
      }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});