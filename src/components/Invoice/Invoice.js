import React from 'react'
import InvoiceItem from './InvoiceItem'
import XButton from '../common/xui/xbutton'

import notificationService, { CASH_IN } from '../../services/notificationService'
import http from '../../services/httpService'
import authService from '../../services/authService'
import XInput from '../common/xui/xinput'
import XSelect from '../common/xui/xselect'

class Invoice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.id,
            items: [],
            discount: 0,
            amountPaid: 0,
            paymentMethods: ['Cash', 'Credit/Debit Card', 'Paypal'],
            paymentMethod: 0
        }
    }

    render() {
        return (
            <section className="invoice card depth-2">
                {(this.state.items.length === 0) ? this.renderNoItems() : this.renderItems()}
            </section>
        )
    }

    calculateTotalPayment() {
        let total = 0
        this.state.items.forEach((item) => {
            total += (item.price * item.quantity)
        })
        return total
    }

    async completeTransacation() {
        if (this.state.amountPaid < this.calculateTotalPayment())
            return notificationService.alertDanger('Not enough funds to complete transaction!')

        try {
            await http.post('/invoices', {
                items: this.state.items,
                discount: this.state.discount,
                paymentMethod: this.state.paymentMethod,
                amountPaid: this.state.amountPaid,
                employeeId: authService.getCurrentUser()._id,
                branchId: authService.getCurrentUser().branchId
            })

            notificationService.alertSuccess('Transaction completed!')
            notificationService.alertAudio(CASH_IN)
            this.reset()
        } catch ({ response }) {
            console.log(response)
            notificationService.alertDanger(response)
        }
    }

    reset() {
        this.setState({
            items: [],
            discount: 0,
            amountPaid: 0
        })
    }

    remove(index) {
        let arr = [...this.state.items]
        arr.splice(index, 1)

        this.setState({
            items: arr
        })
    }

    componentDidMount() {
        // Listen for, and handle, itemclicked event
        document.addEventListener('itemclicked', (e) => {
            this.addItem(e.itemData)
        })

        // Listen for, and handle, barcode scan event
        document.addEventListener('barcode-scanned', (e) => {
            this.addItem(e.itemData)
        })
    }

    setPaymentMethod(index) {
        this.setState({ paymentMethod: index })
    }

    addItem(itemData) {
        const itemIndex = this.state.items.findIndex(item => itemData.id === item.id)
        if (itemIndex >= 0) {
            this.setState(({ items }) => ({
                items: [
                    ...items.slice(0, itemIndex),
                    {
                        ...items[itemIndex],
                        quantity: items[itemIndex].quantity + 1
                    },
                    ...items.slice(itemIndex + 1)
                ]
            }))
        } else {
            const newItem = itemData
            newItem.quantity = 1
            newItem.discount = 0
            this.setState({ items: [...this.state.items, newItem] })
        }
    }

    renderNoItems() {
        return (
            <React.Fragment>
                No items in invoice. Select any from items list to add to invoice.
            </React.Fragment>
        )
    }

    renderItems() {
        const total = this.calculateTotalPayment()
        const items = this.state.items.map((item, index) => {
            return <InvoiceItem key={item.id} id={item.id} _id={item._id} name={item.name} price={item.price} quantity={item.quantity} discount={item.discount} removeHandler={() => this.remove(index)} />
        })

        const paymentOptions = this.state.paymentMethods.map((item, index) => {
            return <option key={index}>{item}</option>
        })

        return (
            <React.Fragment>
                <table style={{ width: '100%', maxHeight: '200px', overflowY: 'scroll' }}>
                    <tbody>
                        {items}
                    </tbody>
                </table>

                <div className='summary'>
                    <div>
                        <p>Discount</p>
                        <p style={{ fontSize: '24px' }}>{this.state.discount}%</p>
                    </div>
                    <div>
                        <p>Total Amount</p>
                        <p style={{ fontSize: '24px' }}>${total}</p>
                    </div>
                    <div>
                        <p>Payable Amount</p>
                        <p style={{ fontSize: '24px' }}>${total - (total * this.state.discount)}</p>
                    </div>
                </div>

                <div>
                    <XSelect options={paymentOptions} label='Payment Method' onChange={(e) => this.setPaymentMethod(e.target.selectedIndex)} />
                </div>

                <div>
                    <XInput type='number' label='Customer Paid' value={this.state.amountPaid} min='0' onChange={(e) => this.setState({ amountPaid: e.target.value })} />
                </div>

                <div>
                    <p>Customer Balance</p>
                    <p style={{ fontSize: '24px' }}>${this.state.amountPaid - (total - (total * this.state.discount))}</p>
                </div>

                <div className='flex-container'>
                    <XButton text='Complete Transaction' clickHandler={() => this.completeTransacation()} />
                    <XButton text='Print' />
                    <XButton text='Clear' clickHandler={() => this.reset()} />
                </div>
            </React.Fragment>
        )
    }
}

export default Invoice
