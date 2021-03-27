import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import StatusLight from '../common/StatusLight/StatusLight'
import StatusContext from '../contexts/StatusContext'

import authService from '../../services/authService'

const Main = ({ children }) => {
    const { syncStatus, cloudConnectionStatus, printServiceStatus } = useContext(StatusContext)

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

            {children}

            <footer>
                <StatusLight state={syncStatus} label='syncing' tooltip={'Ready to sync'} />
                <StatusLight state={cloudConnectionStatus} label='cloud connection' tooltip={'Secure & ready'} />
                <StatusLight state={printServiceStatus} label='print service' tooltip={'Waiting for connection'} />
            </footer>
        </div>
    )
}

export default Main