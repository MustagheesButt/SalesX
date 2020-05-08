const http = require('./httpService')
const knex = require('./dbService')

global.ITEMS_STATUS = 'standby'
async function syncItems() {
    try {
        ITEMS_STATUS = 'in-progress'

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

        ITEMS_STATUS = 'standby'
        return items
    } catch (ex) {
        ITEMS_STATUS = 'error'
        
        if (ex.response)
            console.log(ex.response.data)

        if (ex.sqlMessage)
            console.log(ex.code, ex.sqlMessage)
    }
}

module.exports = {
    syncItems
}