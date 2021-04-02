const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const expressSanitizer = require('express-sanitizer');
const dbHelper = require('./helpers/dbHelper')
const message = require('./constants/log')
const cors = require('cors')

//Init app server
const app = express()

//Set environment variables
dotenv.config()

//Set CORS
app.use(cors())

//Init morgon log
app.use(morgan(process.env.MORGAL_LOG_LEVEL))

//Connect to DB
dbHelper.connect()

//Body parser
app.use(express.json({strict : true }));
app.use(express.urlencoded({ extended: false }));

//Input sanitizer
app.use(expressSanitizer());

//Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

//Undefined Routes
app.all('*', (req, res) => {
    res.status(403).send("UnAuthorized Request")
})

//Set app port
const PORT = process.env.PORT || process.env.DEFAULT_PORT

//Start Server
app.listen(PORT, () => console.log(`${message.info.SERVER_STARTED} ${PORT}`))