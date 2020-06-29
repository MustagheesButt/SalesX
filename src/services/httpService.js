import axios from 'axios'
import logger from './logService'
//import notificationService from './notificationService'

axios.defaults.baseURL = process.env.REACT_APP_API_URL

axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500

    if (!expectedError) {
        logger.log(error)
        //notificationService.alertDanger('An unexpected error occured.')
    }

    return Promise.reject(error)
})

function setJwt(jwt) {
    axios.defaults.headers.common['x-auth-token'] = jwt
}

function unsetJwt(jwt) {
    delete axios.defaults.headers.common['x-auth-token']
}

export default {
    get: axios.get,
    post: axios.post,
    setJwt,
    unsetJwt
}