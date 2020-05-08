const axios = require('axios')

const logger = require('./logService')

axios.defaults.baseURL = 'http://localhost:5000/api'

axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500

    if (!expectedError) {
        logger.log('unexpected error')
        if (error.errno === 'ECONNREFUSED')
            logger.log(`refused ${error.address}:${error.port} ${error.config.url}`)
    }

    return Promise.reject(error)
})

function setJwt(jwt) {
    axios.defaults.headers.common['x-auth-token'] = jwt
    axios.defaults.headers.common['access-control-expose-headers'] = 'x-auth-token'
}

function unsetJwt() {
    axios.defaults.headers.common['x-auth-token'] = null
    axios.defaults.headers.common['access-control-expose-headers'] = null
}

module.exports = {
    get: axios.get,
    post: axios.post,
    setJwt,
    unsetJwt
}