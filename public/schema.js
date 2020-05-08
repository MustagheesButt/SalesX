/*
 * http://knexjs.org/#Schema
 */

const knex = require('./services/dbService')

const tables = {
    'Items': function (table) {
        table.increments()
        table.string('_id')
        table.string('name').notNullable()
        table.float('price').notNullable()
        table.string('barcode')

        table.unique('_id')
    },
    'Inventory': function (table) {
        table.integer('item_id').unsigned()
        table.float('quantity').notNullable()

        table.foreign('item_id').references('Items.id')
    },
    'Invoices': function (table) {
        table.increments()
        table.float('discount')
        table.integer('payment_method').unsigned()
        table.float('amount_paid')
        table.datetime('created_at').defaultTo(knex.fn.now())
        table.boolean('sync_pending').defaultTo(true)
    },
    'Invoice_Items': function (table) {
        table.integer('invoice_id').unsigned()

        table.integer('id').notNullable()
        table.string('_id')
        table.string('name').notNullable()
        table.float('price').notNullable()
        table.float('quantity').notNullable()
        table.float('discount').defaultTo(0)

        table.foreign('invoice_id').references('Invoices.id')
    },
    'meta_info': function(table) {
        table.text('authToken')
        table.datetime('items_synced_at')
    }
}

module.exports = tables