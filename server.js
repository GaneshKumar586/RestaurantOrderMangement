require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000

const cors = require('cors')
const cookieParser = require('cookie-parser')
const { logger, logEvent }= require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions=require('./config/corsOptions')

const dbConn = require('./config/dbConn')
const mongoose = require('mongoose')

console.log(process.env.NODE_ENV)
dbConn()

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
// app.listen(PORT, ()=>{console.log(`Server listening at http://localhost:${PORT}`);})

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())
// routes
app.use('/', express.static(path.join(__dirname,'public')) )
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/orders', require('./routes/orderRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)