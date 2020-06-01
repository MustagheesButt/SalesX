const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors')

const knex = require('./services/dbService')
const http = require('./services/httpService')

const prelude = require('./routes/prelude')
const auth = require('./routes/auth')
const items = require('./routes/items')
const invoices = require('./routes/invoices')
const inventory = require('./routes/inventory')

const PORT = 3005

/* Middlewares */
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

/* Routes */
app.use('/prelude', prelude)
app.use('/auth', auth)
app.use('/items', items)
app.use('/invoices', invoices)
app.use('/inventory', inventory)

app.get('/', (req, res) => {
    res.send('Hello world')
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

/* Status provider */
io.on('connection', (socket) => {
    syncService.setSocket(socket)

    setInterval(() => {
        http.get('/')
            .then(({ data }) => {
                socket.emit('cloud-connection-state-change', 'ok')
            })
            .catch((ex) => {
                socket.emit('cloud-connection-state-change', 'error')
            })
    }, 5000)
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