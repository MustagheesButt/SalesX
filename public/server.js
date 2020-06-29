const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const cors = require('cors')

const PORT = 3005

/* Middlewares */
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world')
})

server.listen(PORT, () => console.log(`Express server listening on port ${PORT}`))

/* Global utility */
global.readJson = function (fileName) {
    const rawdata = fs.readFileSync(path.join(__dirname, fileName))
    return JSON.parse(rawdata)
}

global.writeJson = function (fileName, data) {
    const rawdata = fs.readFileSync(path.join(__dirname, fileName))
    const json = JSON.parse(rawdata)

    for (const key in data) {
        json[key] = data[key]
    }

    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(json, null, 4))
}

module.exports = app