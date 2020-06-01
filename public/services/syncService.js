const http = require('./httpService')
const knex = require('./dbService')

let _socket = null

async function syncItems() {
    try {
        syncNotification('in-progress')

        const lastUpdateAt = (await knex.select('items_synced_at').from('meta_info')).items_synced_at
        
        let items = []
        if (!lastUpdateAt) {
            const { data } = await http.get('/items')
            items = data
        } else {
            const { data } = await http.get(`/items/sync/${lastUpdateAt}`)
            items = data
        }
        
        // if item exists then update, otherwise write to database
        items.forEach(async (item) => {
            const result = await knex.select('_id').from('Items').where({ _id: item._id })
            
            if (result.length === 0) {
                await knex.insert({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    barcode: item.barcode
                }).into('Items')
            } else {
                await knex('Items').where({ _id: item._id }).update({
                    name: item.name,
                    price: item.price,
                    barcode: item.barcode
                })
            }
        })

        // after successfull sync, set items_synced_at in meta_info table
        await knex('meta_info').update({ items_synced_at: new Date().toISOString().slice(0, 19).replace('T', ' ') })

        syncNotification('standby')
        return items
    } catch (ex) {
        syncNotification('error')
        
        if (ex.response)
            console.log(ex.response.data)

        if (ex.sqlMessage)
            console.log(ex.code, ex.sqlMessage)
    }
}

async function syncInventory() {
    try {
        syncNotification('in-progress')

        /* If there are any pending invoices, DO NOT sync inventory */

        const lastUpdateAt = (await knex.select('inventory_synced_at').from('meta_info')).inventory_synced_at
        
        let inventory = []
        if (!lastUpdateAt) {
            const { data } = await http.get(`/branches/${branchId}/inventory`)
            inventory = data
        } else {
            const { data } = await http.get(`/branches/${branchId}/inventory/sync/${lastUpdateAt}`)
            inventory = data
        }
    } catch (ex) {
        console.log(ex)
    }
}

async function syncInvoices() {

}

function setSocket(socket) {
    _socket = socket
    syncNotification('standby')
}

function syncNotification(status) {
    _socket?.emit('sync-status-change', status)
}

module.exports = {
    syncItems,
    syncInventory,
    syncInvoices,
    setSocket
}