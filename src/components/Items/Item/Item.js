import React from 'react'
import XButton from '../../common/xui/xbutton'

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.id,
            _id: props._id,
            name: props.name,
            price: props.price,
            quantity: props.quantity,
            barcode: props.barcode
        }
    }

    itemClicked() {
        const event = document.createEvent("HTMLEvents")
        event.initEvent("itemclicked", true, true)
        event.eventName = "itemclicked"
        event.itemData = this.state
        document.dispatchEvent(event)
    }

    render() {
        return (
            <tr className='item'>
                <td>{this.state.name}</td>
                <td>{this.state.price}</td>
                <td>{this.state.quantity}</td>
                <td><XButton text='Add' clickHandler={() => this.itemClicked()} title='Click to add to invoice' /></td>
            </tr>
        )
    }
}

export default Item
