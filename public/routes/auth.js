const express = require('express')

const http = require('../services/httpService')
const knex = require('../services/dbService')

const router = express.Router()

const apiEndpoint = '/auth'

router.post('/employee', async (req, res) => {
    try {
        const { data } = await http.post(apiEndpoint + '/employee', req.body)
        await knex('meta_info').update({ authToken: data })
        http.setJwt(data)
        res.send(data)
    } catch (ex) {
        if (ex.response)
            res.status(ex.response.status).send(ex.response.data)
        else
            console.log(ex)
    }
})

router.get('/employee/logout', async (req, res) => {
    try {
        await knex('meta_info').update({ authToken: null })
        http.unsetJwt()
        res.send('OK')
    } catch ({ response }) {
        res.status(response.status).send(response.data)
    }
})

module.exports = router