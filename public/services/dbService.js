const { db } = require('../config.json')
const knex = require('knex')({
    client: 'mysql',
    connection: () => ({
        host: db.host,
        user: db.username,
        password: db.password,
        database: 'salesx'
    }),
    acquireConnectionTimeout: 10000
})

module.exports = knex