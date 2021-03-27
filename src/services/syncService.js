import http from './httpService'
import authService from './authService'
import dbService from './dbService'


async function testConnection() {
    try {
        await http.get('/')
        return 1
    } catch(ex) {
        console.log(ex.message)
        return -1
    }
}

async function syncItems() {
    try {
        const itemSchema = dbService.table('Item')

        const lastUpdateAt = localStorage.getItem('items_synced_at')

        let items = []
        if (!lastUpdateAt)
            items = (await http.get('/items'))?.data
        else
            items = (await http.get(`/items/sync/${lastUpdateAt}`))?.data

        if (items.length === 0) return

        // if item exists then update, otherwise write to database
        items.forEach(async (item) => {
            const row = itemSchema.createRow({
                id: item._id,
                name: item.name,
                price: item.price,
                barcode: item.barcode
            })

            await dbService.getDb().insertOrReplace().into(itemSchema).values([row]).exec()
        })

        // after successfull sync, set items_synced_at
        localStorage.setItem('items_synced_at', new Date().toISOString().slice(0, 19).replace('T', ' '))

        return items
    } catch (ex) {
        if (ex.response)
            console.log(ex.response.data)

        console.log(ex)
    }
}

async function syncInventory() {
    try {
        const invoiceSchema = dbService.table('Invoice')
        const inventorySchema = dbService.table('Inventory')

        // If there are any pending invoices, DO NOT sync inventory */
        const pendingInvoices = await dbService.getDb().select(invoiceSchema.sync_pending)
            .from(invoiceSchema).where(invoiceSchema.sync_pending.eq(true)).exec()
        if (pendingInvoices?.length > 0)
            return console.log('Cannot sync inventory. Invoices pending for sync.')

        const lastUpdateAt = localStorage.getItem('inventory_synced_at')

        let inventory = []
        if (!lastUpdateAt)
            inventory = (await http.get(`/branches/${authService.getCurrentUser().branch}/inventory?quantityOnly`))?.data
        else
            inventory = (await http.get(`/branches/${authService.getCurrentUser().branch}/inventory?quantityOnly`))?.data

        if (inventory.length === 0) return

        // if inventoryItem exists then update, otherwise write to database
        inventory.forEach(async (inventoryItem) => {
            const row = inventorySchema.createRow({
                id: inventoryItem.item,
                quantity: inventoryItem.quantity
            })

            await dbService.getDb().insertOrReplace().into(inventorySchema).values([row]).exec()
        })

        // after successfull sync, set items_synced_at
        localStorage.setItem('inventory_synced_at', new Date().toISOString().slice(0, 19).replace('T', ' '))
    } catch (ex) {
        console.log(ex)
    }
}

async function syncInvoices() {
    try {
        const invoiceSchema = dbService.table('Invoice')
        const invoiceItemSchema = dbService.table('Invoice_Item')

        const pendingInvoices = await dbService.getDb().select().from(invoiceSchema)
            .where(invoiceSchema.sync_pending.eq(true)).exec()

        pendingInvoices.forEach(async (invoice) => {
            let invoiceItems = await dbService.getDb().select().from(invoiceItemSchema)
                .where(invoiceItemSchema.invoice_id.eq(invoice.id)).exec()
            
            invoiceItems = invoiceItems.map((item) => {
                return {
                    _id: item.item_id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    discount: item.discount
                }
            })

            await http.post('/invoices', {
                items: invoiceItems,
                discount: invoice.discount,
                paymentMethod: invoice.payment_method,
                amountPaid: invoice.amount_paid,
                createdAt: invoice.created_at,
                employee: authService.getCurrentUser()._id,
                branch: authService.getCurrentUser().branch
            })

            // set that invoice's sync_pending to false
            await dbService.getDb().update(invoiceSchema)
                .set(invoiceSchema.sync_pending, false).where(invoiceSchema.id.eq(invoice.id)).exec()
        })
    } catch (ex) {
        console.log(ex)
    }
}

const syncService = {
    syncItems,
    syncInventory,
    syncInvoices,
    testConnection
}

export default syncService