import React from 'react'

import http from '../../services/httpService'

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
                { id: "11", name: "Dummy 1", price: "100" },
                { id: "22", name: "Dummy 2", price: "100" },
                { id: "33", name: "Dummy 3", price: "100" }
            ]
        }
    }

    async componentDidMount() {
        const { data: items } = await http.get('/items')
        this.setState({ items })
    }

    render() {
        return (
            <React.Fragment>
                <VideoScanner />

                <section className='items-list card depth-2'>
                    <XInput placeholder='Filter items' onChange={e => this.updateFilter(e)} />

                    {this.renderTable()}
                </section>
            </React.Fragment>
        )
    }

    renderTable() {
        const items = this.state.items.filter(item => {
            if (item.name.toLowerCase().indexOf(this.state.filter) === -1)
                return false
            return true
        }).map(item => {
            return <Item key={item.id} id={item.id} _id={item._id} name={item.name} price={item.price} />
        })

        if (items.length === 0) {
            return (
                <p>It looks like you don't have any items, or they are taking too long to load. Please contact your management.</p>
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
