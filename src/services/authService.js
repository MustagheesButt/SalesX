import jwtDecode from 'jwt-decode'

import http from './httpService'

const apiEndpoint = '/auth/employee'

http.setJwt(getJwt())

async function login(emailOrPhone, password) {
    try {
        const { data: jwt } = await http.post(apiEndpoint, { emailOrPhone, password })
        http.setJwt(jwt)
        localStorage.setItem('jwt', jwt)
    } catch (ex) {
        if (ex.response)
            console.log(ex.response.status, ex.response.data)
        else
            console.log(ex)
    }
}

function loginWithJwt(jwt) {
    localStorage.setItem('jwt', jwt)
}

function logout() {
    http.unsetJwt()
    localStorage.removeItem('jwt')
}

function getCurrentUser() {
    try {
        const token = localStorage.getItem('jwt')
        return jwtDecode(token)
    } catch (ex) {
        return null
    }
}

function getJwt() {
    return localStorage.getItem('jwt')
}

const authService = {
    login,
    loginWithJwt,
    logout,
    getCurrentUser,
    getJwt
}

export default authService