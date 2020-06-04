import React from 'react'
import XButton from '../common/xui/xbutton';

class InvoiceItem extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.id,
            name: props.name,
            price: props.price,
            quantity: props.quantity,
            discount: props.discount
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.quantity !== this.props.quantity) {
            this.setState({ quantity: this.props.quantity });
        }
    }

    render() {
        return (
            <tr>
                <td>{this.state.name}</td>
                <td>{this.state.quantity}</td>
                <td>${this.state.price}</td>
                <td><XButton text='Remove' clickHandler={this.props.removeHandler} /></td>
            </tr>
        )
    }
}

export default InvoiceItem
