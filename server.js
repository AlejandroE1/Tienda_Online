const express = require('express');

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', require('./routes/router'));

app.listen(5000, () => {
  console.log('Server corriendo en http://localhost:5000');
});
