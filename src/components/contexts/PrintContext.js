import React, { createContext, useState, useEffect } from 'react'
//import printService from '../../services/printService'

const SYNC_INTERVAL = 5000
const PrintContext = createContext()

let ws = new WebSocket('ws://localhost:5003')

export const PrintProvider = ({ children }) => {
    const [printers, setPrinters] = useState([])
    const [selectedPrinter, setSelectedPrinter] = useState(-1)
    const [serviceStatus, setServiceStatus] = useState(100)

    ws.onopen = () => {
        console.info('Connected to PrintService')
        setServiceStatus(200)
    }

    ws.onerror = () => {
        setServiceStatus(400)
    }

    ws.onclose = () => {
        console.log('Connection to print service lost. Attempting to reconnect in 5s.')
        setServiceStatus(400) 
        setTimeout(function() {
            ws = new WebSocket('ws://localhost:5003')
        }, 5000)
    }

    ws.addEventListener('message', (response) => {
        const data = JSON.parse(response.data)
        
        if (data.msg === 'list') {
            console.log('received list')
            setPrinters(data.data)
        }
    })

    useEffect(() => {
        const idx = setInterval(async function () {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({msg: 'list'}))
            }
        }, SYNC_INTERVAL)

        return () => {
            clearInterval(idx)
        }
    })

    return <PrintContext.Provider value={{ printers, selectedPrinter, setSelectedPrinter, serviceStatus }}>{children}</PrintContext.Provider>
}

export default PrintContext