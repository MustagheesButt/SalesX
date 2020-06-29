import React, { createContext, useState, useEffect } from 'react'
import syncService from '../../services/syncService'

const SYNC_INTERVAL = process.env.REACT_APP_SYNC_INTERVAL

const StatusContext = createContext()

export const StatusProvider = ({ children }) => {
    const [syncStatus, setSyncStatus] = useState('standby')
    const [cloudConnectionStatus, setCloudConnectionStatus] = useState('standby')

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
    })
    console.log('SP reset')

    return <StatusContext.Provider value={{ syncStatus, cloudConnectionStatus }}>{children}</StatusContext.Provider>
}

export default StatusContext