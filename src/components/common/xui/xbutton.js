import React from 'react'

import './xbutton.css'

const XButton = ({clickHandler, text, ...rest}) => {
    return (
        <span className='btn' onClick={clickHandler} {...rest}>{text}</span>
    )
}

export default XButton