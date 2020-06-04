import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import ProtectedRoute from '../components/common/protectedRoute'
import syncService from '../services/syncService'

import Prelude from './Prelude/Prelude'
import Login from './Auth/login'
import Dashboard from './Dashboard/Dashboard'
import Inventory from './Inventory/Inventory'
import Settings from './Settings/Settings'

import './App.css'


const App = (props) => {
    setInterval(function () {
        syncService.syncItems()
        syncService.syncInventory()
        syncService.syncInvoices()
    }, 10000)

    return (
        <Router>
            <Route path='/' exact component={Prelude} />
            <Route path='/login' component={Login} />

            <ProtectedRoute path='/dashboard' component={Dashboard} />
            <ProtectedRoute path='/inventory' component={Inventory} />
            <ProtectedRoute path='/settings' component={Settings} />
        </Router>
    )
}

export default App
