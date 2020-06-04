import React from 'react'
import { NavLink } from 'react-router-dom'

import StatusLight from '../common/StatusLight/StatusLight'

import authService from '../../services/authService'

class Main extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            syncing: {
                status: 'standby',
                msg: 'Ready to sync any changes'
            },
            cloud: {
                status: 'error',
                msg: 'Failed to establish a connection' // 'Secure & Ready'
            }
        }
    }

    componentDidMount() {
        // const socket = io(process.env.REACT_APP_API_URL)
        // socket.on('sync-status-change', (data) => {
        //     let syncState = {}
        //     if (data === 'error') {
        //         syncState = {status: 'error', msg: 'Failed to sync'}
        //     } else if (data === 'in-progress') {
        //         syncState = {status: 'in-progress', msg: 'Syncronizing'}
        //     } else if (data === 'standby') {
        //         syncState = {status: 'standby', msg: 'Ready to sync'}
        //     }
        //     this.setState({ syncing: syncState })
        // })

        // socket.on('cloud-connection-state-change', (data) => {
        //     let cloudState = {}
        //     if (data === 'error') {
        //         cloudState = {status: 'error', msg: 'Failed to establish a connection'}
        //     } else if (data === 'ok') {
        //         cloudState = {status: 'ok', msg: 'Connected :)'}
        //     }
        //     this.setState({ cloud: cloudState })
        // })
    }

    render() {
        const currentEmployee = authService.getCurrentUser()
        return (
            <div className='grid-container' id='main-grid'>
                <header>
                    <nav className='d-flex' style={{ alignItems: 'center', margin: '0 15px' }}>
                        <NavLink className='btn btn-default' to='/settings'>{currentEmployee.firstName} {currentEmployee.lastName}</NavLink>
                        <NavLink className='btn btn-default' to='/dashboard'>Dashboard</NavLink>
                        <NavLink className='btn btn-default' to='/inventory'>Inventory</NavLink>
                        <NavLink className='btn btn-default' to='/settings'>Settings</NavLink>
                    </nav>
                </header>

                {this.props.children}

                <footer>
                    <StatusLight state={this.state.syncing.status} label='syncing' tooltip={this.state.syncing.msg} />
                    <StatusLight state={this.state.cloud.status} label='cloud connection' tooltip={this.state.cloud.msg} />
                </footer>
            </div>
        )
    }
}

export default Main