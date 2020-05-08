const express = require('express')

const http = require('../services/httpService')
const knex = require('../services/dbService')

const tables = require('../schema')

const router = express.Router()

router.get('/database', async (req, res) => {
    try {
        const result = await knex.raw('SELECT 1 + 1 as result')
        res.send('OK')
    } catch (ex) {
        console.log(ex)
        res.status(400).send('FAIL')
    }
})

router.get('/setup-tables', async (req, res) => {
    try {
        for (const table in tables) {
            const exists = await knex.schema.withSchema('salesx').hasTable(table)

            if (!exists) {
                console.log(`Creating table ${table}...`)
                await knex.schema.withSchema('salesx')
                    .createTable(table, tables[table])
                console.log(`Created table ${table}`)
            } else {
                console.log(`${table} table already exists!`)
            }
        }

        // setup meta_info table
        const rows = await knex.select('*').from('meta_info')

        if (rows.length === 0)
            await knex.insert({ authToken: null, items_synced_at: null }).into('meta_info')

        res.send('OK')
    } catch (ex) {
        console.log(ex)
        res.status(400).send('FAIL')
    }
})

router.get('/session', async (req, res) => {
    try {
        const authToken = (await knex.select('authToken').from('meta_info'))[0].authToken

        if (authToken) {
            http.setJwt(authToken)
            console.log('session restored successfully')
            res.send('OK session found')
        }
        else
            res.send('OK session not found')
    } catch (ex) {
        console.log(ex)
        res.status(500).send('FAIL')
    }
})

module.exports = router