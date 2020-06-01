const express = require('express')

const knex = require('../services/dbService')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let rows = await knex.select('*').from('Inventory')
        res.send(rows)
    } catch (ex) {
        console.log(ex)
        res.status(500).send('Could not fetch data')
    }
})

router.get('/:itemId', async (req, res) => {
    try {
        let rows = await knex.select('*').from('Inventory').where({ item_id: req.params.itemId })
        
        if (rows.length > 0)
            rows = rows[0]
        
        res.send(rows)
    } catch (ex) {
        console.log(ex)
        res.status(500).send('Could not fetch data')
    }
})

module.exports = router