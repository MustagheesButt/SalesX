import React from 'react'

const selectStyle = {
    border: '0',
    borderBottom: '2px solid blueviolet',
    padding: '5px',
    color: '#ffffff',
    outline: 'none'
}

const XSelect = ({ name, label, error, options, ...rest }) => {
    return (
        <div className='form-group'>
            <label>{label}</label>
            <select className='form-control depth-1' name={name} {...rest} style={selectStyle}>
                {options}
            </select>
            <div className='alert alert-danger'>
                {error}
            </div>
        </div>
    )
}

export default XSelect