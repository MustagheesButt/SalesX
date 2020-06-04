import React from 'react'

import './xbutton.css'

const XButton = ({ to, clickHandler, text, type, ...rest }) => {
    return (
        <button
            className={type ? `btn btn-${type}` : 'btn btn-default'}
            onClick={clickHandler}
            {...rest}>
            {text || rest.children}
        </button>
    )
}

export default XButton