import React from 'react'

import dbService from '../../services/dbService'

import Item from './Item/Item'
import VideoScanner from '../../components/common/VideoScanner/VideoScanner'
import XInput from '../../components/common/xui/xinput'

import './Items.css'

class Items extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: '',
            items: [
                { id: "11", name: "Dummy 1", price: "100", quantity: 1 },
                { id: "22", name: "Dummy 2", price: "100", quantity: 1 },
                { id: "33", name: "Dummy 3", price: "100", quantity: 1 }
            ],
            inventory: []
        }
    }

    async componentDidMount() {
        try {
            const itemSchema = dbService.table('Item')
            const inventorySchema = dbService.table('Inventory')

            const items = await dbService.getDb()?.select().from(itemSchema).exec()
            const inventory = await dbService.getDb()?.select().from(inventorySchema).exec()

            this.setState({ items, inventory })
        } catch (ex) {
            console.log(ex)
        }
    }

    render() {
        return (
            <React.Fragment>
                <VideoScanner />

                <section className='items-list card depth-2'>
                    <XInput placeholder='Filter items' onChange={e => this.updateFilter(e)} />

                    {this.state.items.length > 0 ?
                        this.renderTable() :
                        <p>It looks like you don't have any items, or they are taking too long to load.
                            Please contact your management</p>}
                </section>
            </React.Fragment>
        )
    }

    renderTable() {
        const items = this.state.items.filter(item => {
            return !(item.name.toLowerCase().indexOf(this.state.filter) === -1)
        }).map(item => {
            return <Item
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity || this.state.inventory.find(inventoryItem => item.id === inventoryItem.id)?.quantity || 'N/A'} />
        })

        if (items.length === 0) {
            return (
                <p>Filter does not match any items.</p>
            )
        } else {
            return (
                <table className='items-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            )
        }
    }

    updateFilter(event) {
        this.setState({
            filter: event.target.value
        })
    }
}

export default Items
