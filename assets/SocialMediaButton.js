import React from 'react';
import Facebook from '../public/icons/facebook.svg'


const FacebookButton = props => {
    
    return (
            <button className="_buildon-social-media-button">
                <img src={Facebook} /> <span>Login via Facebook</span>
            </button>
        )
    
}

export {
    FacebookButton
}