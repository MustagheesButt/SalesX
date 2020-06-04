import lf from 'lovefield'

const schemaBuilder = lf.schema.create('salesx', 1)

schemaBuilder.createTable('Item')
    .addColumn('id', lf.Type.STRING)
    .addColumn('name', lf.Type.STRING)
    .addColumn('price', lf.Type.NUMBER)
    .addColumn('barcode', lf.Type.STRING)
    .addPrimaryKey(['id'])
    .addNullable(['barcode'])

schemaBuilder.createTable('Inventory')
    .addColumn('id', lf.Type.STRING)
    .addColumn('quantity', lf.Type.NUMBER)
    .addPrimaryKey(['id'])

schemaBuilder.createTable('Invoice')
    .addColumn('id', lf.Type.INTEGER)
    .addColumn('discount', lf.Type.NUMBER)
    .addColumn('payment_method', lf.Type.INTEGER)
    .addColumn('amount_paid', lf.Type.NUMBER)
    .addColumn('created_at', lf.Type.DATE_TIME) // should default to current date
    .addColumn('sync_pending', lf.Type.BOOLEAN)
    .addPrimaryKey([{ 'name': 'id', 'autoIncrement': true }])

schemaBuilder.createTable('Invoice_Item')
    .addColumn('id', lf.Type.INTEGER)
    .addColumn('invoice_id', lf.Type.INTEGER)
    .addColumn('item_id', lf.Type.STRING)
    .addColumn('name', lf.Type.STRING)
    .addColumn('price', lf.Type.NUMBER)
    .addColumn('quantity', lf.Type.NUMBER)
    .addColumn('discount', lf.Type.NUMBER)
    .addPrimaryKey([{ 'name': 'id', 'autoIncrement': true }])
    .addUnique('pk', ['invoice_id', 'item_id'])
    .addForeignKey('fk_invoice_id', {
        local: 'invoice_id',
        ref: 'Invoice.id',
        action: lf.ConstraintAction.CASCADE
    })

let salesxDb = null

async function init() {
    try {
        salesxDb = await schemaBuilder.connect()
    } catch (ex) {
        console.log(ex)
    }
}

function table(tableName) {
    return salesxDb?.getSchema().table(tableName)
}

function getDb() {
    return salesxDb
}

export default {
    init,
    table,
    getDb
}