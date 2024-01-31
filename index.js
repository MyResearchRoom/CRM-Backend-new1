const express = require('express');
const app = express();
const port =  process.env.PORT||5000;
const cors = require('cors');

app.use(cors());

//const dbroutes = require('./routes/db');
const signup = require('./routes/signup');
const login = require('./routes/login');
const addproject = require('./routes/Addproject');
const addemployee = require('./routes/Addemployee');
const adddepartment = require('./routes/Adddepartment');
const addmeeting = require('./routes/Addmeeting');
const addProfile = require('./routes/Addprofile');
const changepassword= require('./routes/changepassword');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('new node js');
});

app.use(addproject);
app.use(addemployee);
app.use(adddepartment);
app.use(addmeeting);
app.use(addProfile);
app.use(signup);
app.use(login);
app.use(changepassword);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


