const express = require('express')
const connectDB = require('./config/db')
const app = express()
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 5000
const errorMiddleware = require('./middeware/error')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const gameRouter = require('./routes/gameRouter')
app.use('/api/v1/game', gameRouter)

connectDB()

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}


app.use(errorMiddleware)

const server = app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(() => {
        process.exit(1);
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(() => {
        process.exit(1);
    })
})