require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

app.use(cors());

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

require('./src/controllers/authController')(app);

app.listen(process.env.PORT || 3000);