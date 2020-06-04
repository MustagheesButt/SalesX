import React from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

import http from '../../services/httpService'

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
            const videoInputDevices = await this.codeReader.listVideoInputDevices()
            this.setState({ videoDevices: videoInputDevices }, this.renderVideo)
        } catch (ex) {
            console.error(ex)
        }
    }

    updateSelectedDevice(index) {
        this.setState({ selectedDevice: index }, async () => {
            const response = await http.post('http://localhost:3005/input-video-device', {
                videoInputDevice: this.state.videoDevices[index].label
            })

            console.log(response)
        })
    }

    async renderVideo() {
        try {
            const result = await this.codeReader.decodeOnceFromVideoDevice(this.state.videoDevices[this.state.selectedDevice].deviceId, 'video')
            console.log(result.text)
        } catch (ex) {
            console.error(ex)
        }
    }

    async componentDidMount() {
        this.updateVideoDevices()

        const { data } = await http.get('http://localhost:3005/input-video-device')
        this.setState({ inputVideoDeviceId: data.inputVideoDeviceId })
    }

    render() {
        const options = this.state.videoDevices.map(device => {
            return <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
        })

        return (
            <div>
                <video
                    id="video"
                    width="300"
                    height="200"
                    style={{ border: '1px solid gray' }}></video>

                <select onChange={(e) => { this.updateSelectedDevice(e.target.selectedIndex) }}>
                    {options}
                </select>
            </div>
        )
    }

    componentWillUnmount() {
        this.codeReader.stopStreams()
        console.log('Unmounted Settings')
    }
}

export default VideoDeviceSelector