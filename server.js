const express = require("express")
const app = express();
const path = require('path');
const cors = require("cors")
const cookieParser = require('cookie-parser')
const DBconnect = require('./config/DBconnect')
require('dotenv').config()

const UserRoutes = require('./routes/userRoutes')

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
DBconnect();
app.use('/api/', UserRoutes)

app.get('/', (req, res) => {
    res.send({ "status": "working" })
})

app.listen(process.env.PORT || 5000, (req, res) => {
    console.log('server is running on port 5000')
})