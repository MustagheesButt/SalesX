import React from 'react'

import './authentication.css'
import LoginForm from '../../components/forms/loginForm'

import bg from '../../assets/login-bg.jpg'

const Login = (props) => {
    return (
        <main id='auth' className='grid-container' style={{backgroundImage: `url(${bg})`}}>
            <div style={{ margin: 'auto' }}>
                <h1>Login to your <span style={{ color: '#5198e2' }}>SalesX</span> account.</h1>
            </div>

            <section className='card depth-2' style={{ margin: 'auto', width: '25%' }}>
                <div>
                    <LoginForm {...props} />
                </div>
            </section>
        </main>
    )
}

export default Login