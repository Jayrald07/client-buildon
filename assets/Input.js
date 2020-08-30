import React, { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Input = ({ postIcon, handleChange, handleValue, ...props }) => {

    const [isOn, setIsOn] = useState(false);

    return (
        <div className="_buildon-input-container" style={{ border: props.error === 'true' ? "1px solid #a83d3d" : null }}>
            {
                props.type === 'password'
                    ?
                    <input {...props} value={handleValue} onChange={(e) => handleChange(e.target.value)} type={isOn ? "text" : "password"} className="_buildon-input" />
                    :
                    <input {...props} value={handleValue} onChange={(e) => handleChange(e.target.value)} className="_buildon-input" />
            }
            {
                props.type === 'password'
                    ?
                    isOn
                        ?
                        <EyeOutlined onClick={() => setIsOn(!isOn)} />
                        :
                        <EyeInvisibleOutlined onClick={() => setIsOn(!isOn)} />
                    :
                    null
            }

            {
                postIcon ?
                    postIcon
                    : null
            }
        </div>
    )

}

export default React.memo(Input);