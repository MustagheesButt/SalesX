import React, { createContext, useContext, useState, useEffect } from 'react'
import syncService from '../../services/syncService'
import PrintContext from './PrintContext'

const SYNC_INTERVAL = process.env.REACT_APP_SYNC_INTERVAL

const StatusContext = createContext()

export const StatusProvider = ({ children }) => {
    const [syncStatus, setSyncStatus] = useState('standby')
    const [cloudConnectionStatus, setCloudConnectionStatus] = useState('standby')
    const [printServiceStatus, setPrintServiceStatus] = useState('standby')
    
    const { serviceStatus : _printServiceStatus } = useContext(PrintContext)

    useEffect(() => {
        const idx = setInterval(async function () {
            const cloudStatus = await syncService.testConnection()
            if (cloudStatus === -1)
                setCloudConnectionStatus('error')
            else {
                setCloudConnectionStatus('ok')
                setSyncStatus('in-progress')
                await syncService.syncItems()
                await syncService.syncInventory()
                await syncService.syncInvoices()
                setSyncStatus('standby')
            }
        }, SYNC_INTERVAL)

        return () => {
            clearInterval(idx)
        }
    }, [])

    useEffect(() => {
        if (_printServiceStatus === 400)
            setPrintServiceStatus('error')
        else if (_printServiceStatus === 200)
            setPrintServiceStatus('ok')
        else if (_printServiceStatus === 100)
            setPrintServiceStatus('standby')
    }, [_printServiceStatus])

    return <StatusContext.Provider value={{ syncStatus, cloudConnectionStatus, printServiceStatus }}>{children}</StatusContext.Provider>
}

export default StatusContext