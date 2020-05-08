const express = require('express')

const http = require('../services/httpService')
const knex = require('../services/dbService')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let rows = await knex.select('*').from('Items')
        res.send(rows)
    } catch (ex) {
        console.log(ex)
        res.send([])
    }
})

module.exports = router