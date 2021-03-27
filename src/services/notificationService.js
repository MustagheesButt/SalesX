import { toast } from 'react-toastify'

import audioService from './audioService'

import 'react-toastify/dist/ReactToastify.min.css'

toast.configure()

function alertInfo(msg) {
    toast.info(msg)
}

function alertWarning(msg) {
    toast.warn(msg)
}

function alertSuccess(msg) {
    toast.success(msg)
}

function alertDanger(msg) {
    toast.error(msg)
}

export const CASH_IN = 'cash_in.mp3'
function alertAudio(name) {
    audioService.play(name)
}

const notificationService = {
    alertInfo,
    alertWarning,
    alertSuccess,
    alertDanger,
    alertAudio
}

export default notificationService