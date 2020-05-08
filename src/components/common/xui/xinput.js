import React from 'react'

const inputStyle = {
    border: '0',
    borderBottom: '2px solid blueviolet',
    padding: '5px',
    color: '#ffffff',
    outline: 'none'
}

const XInput = ({ name, label, error, ...rest }) => {
    return (
        <div className='form-group'>
            <label>{label}</label>
            <input className='form-control depth-1' name={name} {...rest} style={inputStyle} />
            <div className='alert alert-danger'>
                {error}
            </div>
        </div>
    )
}

export default XInput