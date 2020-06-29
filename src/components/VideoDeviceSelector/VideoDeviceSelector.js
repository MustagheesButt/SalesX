import React from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

import XSelect from '../common/xui/xselect'


class VideoDeviceSelector extends React.Component {
    constructor(props) {
        super(props)

        this.codeReader = new BrowserQRCodeReader()

        this.state = {
            selectedDevice: 0,
            videoDevices: []
        }
    }

    async updateVideoDevices() {
        try {
            const videoDevices = await this.codeReader.listVideoInputDevices()
            videoDevices.unshift({ deviceId: -1, label: 'None' })
            this.setState({ videoDevices })
        } catch (ex) {
            console.error(ex)
        }
    }

    updateSelectedDevice(index) {
        this.codeReader.stopStreams()
        localStorage.setItem('videoDeviceId', this.state.videoDevices[index].label)
        this.setState({ selectedDevice: index }, this.renderVideo)
    }

    async renderVideo() {
        if (this.state.videoDevices[this.state.selectedDevice].deviceId === -1) return

        try {
            const result = await this.codeReader.decodeOnceFromVideoDevice(this.state.videoDevices[this.state.selectedDevice].deviceId, 'video')
            console.log(result.text)
        } catch (ex) {
            console.error(ex)
        }
    }

    async componentDidMount() {
        await this.updateVideoDevices()

        const selectedDevice = localStorage.getItem('videoDeviceId')
        const i = this.state.videoDevices.findIndex(device => device.label === selectedDevice)
        console.log(i)
        this.setState({ selectedDevice: (i > -1) ? i : 0 }, this.renderVideo)
    }

    render() {
        const { videoDevices, selectedDevice } = this.state

        const options = videoDevices.map(device => {
            return <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
        })

        return (
            <div>
                {videoDevices[selectedDevice]?.deviceId !== -1 &&
                    <video
                        id="video"
                        width="300"
                        height="200"
                        style={{ border: '1px solid gray' }}></video>}

                <XSelect
                    options={options}
                    value={videoDevices[selectedDevice]?.deviceId}
                    onChange={(e) => { this.updateSelectedDevice(e.target.selectedIndex) }} />
            </div>
        )
    }

    componentWillUnmount() {
        this.codeReader.stopStreams()
        console.log('Unmounted Settings')
    }
}

export default VideoDeviceSelector