const express = require('express')

const http = require('../services/httpService')
const logger = require('../services/logService')
const knex = require('../services/dbService')

const router = express.Router()

const apiEndpoint = '/invoices'

router.get('/', (req, res) => {
    res.status(501).send('Not Implemented')
})

router.post('/', async (req, res) => {
    const { items, discount, paymentMethod, amountPaid, employeeId, branchId } = req.body
    let invoice = null

    try {
        await knex.transaction(async trx => {
            invoice = await trx('Invoices')
                .insert({
                    discount,
                    payment_method: paymentMethod,
                    amount_paid: amountPaid
                })

            items.forEach(item => item.invoice_id = invoice[0])

            await trx('Invoice_Items').insert(items)
        })
        res.send('OK')
    } catch (ex) {
        logger.log(ex)
        return res.status(500).send('Transaction failed')
    }

    // Try to sync generated invoice right now
    try {
        invoice = (await knex.select('id', 'created_at').from('Invoices').where({ id: invoice[0] }))[0]

        items.forEach(item => {
            delete item.id
            delete item.invoice_id
        })

        const result = await http.post(apiEndpoint, {
            discount,
            paymentMethod,
            amountPaid,
            createdAt: invoice.created_at,
            employeeId,
            branchId,
            items
        })

        await knex('Invoices').update({ sync_pending: false }).where({ id: invoice.id })
    } catch (ex) {
        logger.log(`Could not sync invoice with id ${invoice.id}`)
        
        if (ex.response)
            logger.log(ex.response.data)

        if (ex.sqlMessage)
            logger.log(`${ex.code}: ${ex.sqlMessage}`)
    }
})

module.exports = router