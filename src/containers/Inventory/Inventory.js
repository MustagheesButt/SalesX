import React from 'react'

import dbService from '../../services/dbService'

import Main from '../../components/templates/Main'
import XInput from '../../components/common/xui/xinput'

import './Inventory.css'

class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: '',
            items: [],
            inventory: []
        }
    }

    componentDidMount() {
        this.getItemsAndInventory()
    }

    async getItemsAndInventory() {
        try {
            const itemSchema = dbService.table('Item')
            const inventorySchema = dbService.table('Inventory')

            const items = await dbService.getDb().select().from(itemSchema).exec()
            const inventory = await dbService.getDb().select().from(inventorySchema).exec()

            this.setState({ items, inventory })
        } catch (ex) {
            console.log(ex)
        }
    }

    render() {
        if (this.state.items.length === 0)
            return (
                <Main>
                    <main>
                        <section className='inventory card depth-2'>
                            <p>No inventory items to display.</p>
                        </section>
                    </main>
                </Main>
            )

        const inventoryItems = this.state.items.filter(item => {
            const filterValue = this.state.filter.toLowerCase()
            return !(item.name.toLowerCase().indexOf(filterValue) === -1 && item.id.indexOf(filterValue) === -1 && item.barcode.indexOf(filterValue) === -1)
        }).map((item, index) => {
            const quantity = this.state.inventory[index]?.quantity
            return (
                <tr key={item.id} className={`${quantity < 10 ? 'low' : ''}`}>
                    <td>{item.id}</td>
                    <td>{item.barcode}</td>
                    <td>{item.name}</td>
                    <td>{quantity || 'N/A'}</td>
                </tr>
            )
        })

        return (
            <Main>
                <main>
                    <section className='inventory card depth-2'>
                        <XInput onChange={e => this.updateFilter(e)} placeholder='Filter items' />

                        {(inventoryItems.length === 0) ?
                            'No items match your search.' : this.renderTable(inventoryItems)
                        }
                    </section>
                </main>
            </Main>
        )
    }

    renderTable(inventoryItems) {
        return (
            <table className='items-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Barcode</th>
                        <th>Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems}
                </tbody>
            </table>
        )
    }

    updateFilter(event) {
        this.setState({
            filter: event.target.value
        })
    }
}

export default Settings