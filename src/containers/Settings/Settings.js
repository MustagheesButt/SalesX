import React from 'react'

import authService from '../../services/authService'
import PrintContext from '../../components/contexts/PrintContext'

import Main from '../../components/templates/Main'
import VideoDeviceSelector from '../../components/VideoDeviceSelector/VideoDeviceSelector'
import XButton from '../../components/common/xui/xbutton'
import XSelect from '../../components/common/xui/xselect'

import './Settings.css'

class Settings extends React.Component {
    static contextType = PrintContext;

    logout() {
        authService.logout()
        window.location = '/#/dashboard'
    }

    render() {
        const currEmployee = authService.getCurrentUser()
        const printerOptions = this.context.printers.map((printer) => {
            return (
                <option key={printer} value={printer}>{printer}</option>
            )
        })

        return (
            <Main>
                <main>
                    <section className='card depth-2 video-selector'>
                        <h3>Barcode Scanning Configuration</h3>

                        <VideoDeviceSelector />
                    </section>

                    <section className='card depth-2 employee-account'>
                        <h3>Logged in as</h3>

                        <div>
                            <h2>{currEmployee.firstName} {currEmployee.lastName}</h2>
                            <XButton text='Logout' clickHandler={this.logout} />
                        </div>
                    </section>

                    <section className='card depth-2'>
                        <h3>Printers</h3>

                        <div>
                            <XSelect options={printerOptions} label="Select Printer" onChange={(e) => {this.context.setSelectedPrinter(e.target.value)}} />
                        </div>
                    </section>
                </main>
            </Main>
        )
    }
}

export default Settings