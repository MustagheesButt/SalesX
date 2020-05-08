import React from 'react'

import http from '../../services/httpService'

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
            const { data: items } = await http.get('/items')
            const { data: inventory } = await http.get('/inventory')

            this.setState({
                items,
                inventory
            })
        } catch (ex) {
            console.log(ex)
        }
    }

    render() {
        const inventoryItems = this.state.items.filter(item => {
            if (item.name.toLowerCase().indexOf(this.state.filter) === -1)
                return false
            return true
        }).map((item, index) => {
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.barcode}</td>
                    <td>{item.name}</td>
                    <td>{this.state.inventory[index]?.quantity || 0}</td>
                </tr>
            )
        })

        return (
            <Main>
                <main>
                    <section className='inventory card depth-2'>
                        <XInput onChange={e => this.updateFilter(e)} placeholder='Filter items' />

                        {
                            (this.state.filter.length > 0 && inventoryItems.length === 0) ?
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