import React from 'react'
import { NavLink } from 'react-router-dom'

import XButton from '../common/xui/xbutton'
import StatusLight from '../common/StatusLight/StatusLight'

import http from '../../services/httpService'
import authService from '../../services/authService'

class Main extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            syncing: {
                status: 'standby',
                msg: 'Ready to sync any changes'
            },
            connection: {
                status: 'error',
                msg: 'Failed to establish a connection' // 'Secure & Ready'
            }
        }
    }

    componentDidMount() {
        setInterval(async () => {
            const { data } = await http.get('/status/sync')
            let syncState = {}
            if (data === 'error') {
                syncState = {status: 'error', msg: 'Failed to sync'}
            } else if (data === 'in-progress') {
                syncState = {status: 'in-progress', msg: 'Syncronizing'}
            } else if (data === 'standby') {
                syncState = {status: 'standby', msg: 'Ready to sync'}
            }
            this.setState({ syncing: syncState })
        }, 500)
    }

    render() {
        const currentEmployee = authService.getCurrentUser()
        return (
            <div className='grid-container' id='main-grid'>
                <header>
                    <XButton text={`${currentEmployee.firstName} ${currentEmployee.lastName}`} />
                    <NavLink to='/dashboard' className='btn'>Dashboard</NavLink>
                    <NavLink to='/inventory' className='btn'>Inventory</NavLink>
                    <NavLink to='/settings' className='btn'>Settings</NavLink>
                </header>
    
                {this.props.children}
    
                <footer>
                    <StatusLight state={this.state.syncing.status} label='syncing' tooltip={this.state.syncing.msg} />
                    <StatusLight state={this.state.connection.status} label='cloud connection' tooltip={this.state.connection.msg} />
                </footer>
            </div>
        )
    }
}

export default Main