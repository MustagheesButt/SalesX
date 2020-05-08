const express = require('express')

const router = express.Router()

router.get('/sync', (req, res) => {
    res.send(ITEMS_STATUS)
})

module.exports = router