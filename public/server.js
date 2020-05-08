const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors')

const knex = require('./services/dbService')

const prelude = require('./routes/prelude')
const status = require('./routes/status')
const auth = require('./routes/auth')
const items = require('./routes/items')
const invoices = require('./routes/invoices')

const PORT = 3005

/* Middlewares */
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

/* Routes */
app.use('/prelude', prelude)
app.use('/status', status)
app.use('/auth', auth)
app.use('/items', items)
app.use('/invoices', invoices)

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/inventory', (req, res) => {
    let result = knex.select('*').from('Inventory')
    result.then((rows) => {
        console.log(rows)
        res.send(rows)
    }, function (err) {
        res.send(err)
    })
})

/* Configuration API */
app.route('/input-video-device')
    .get((req, res) => {
        const json = readJson('config.json')

        res.send(json)
    })
    .post((req, res) => {
        if (req.body.videoInputDevice) {
            writeJson('config.json', req.body)
            res.send('saved')
        } else {
            res.status(400).send('malformed request')
        }
    })

/* Database synchronization with API */
const syncService = require('./services/syncService')
setInterval(function () {
    syncService.syncItems()
}, 10000)

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

server.listen(PORT, () => console.log(`Express server listening on port ${PORT}`))

module.exports = app