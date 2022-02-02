const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('db connected'))
  .catch(e => console.log(e));
app.use(cors());
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

function userMiddleWare(req, res, next) {
  console.log(`${req.method} ${req.path} ${req.params}`);
  next();
}

app.use('/api/users', userMiddleWare, require('./routes/user'));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
