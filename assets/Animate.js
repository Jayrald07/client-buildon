import React, {useState, useEffect} from 'react';

const Animate = (props) => {
    
    const [isFirstRender,setIsFirstRender] = useState(true);
    
    useEffect(() => {
        if (props.on) {
            React.Children.map(props.children,(child,i) => {
                setTimeout(() => {
                    child.ref.current.classList.toggle("on");
                    child.ref.current.classList.toggle("off");
                },props.delay * i + 1);
            });
        } else {
            React.Children.map(props.children,(child,i) => {
                setTimeout(() => {
                    if (child.ref.current.classList[1] === "on") {
                        child.ref.current.classList.toggle("off");
                        child.ref.current.classList.toggle("on");
                    }
                },props.delay * i + 1);
            });
        }
    },[props.on]);
    
    return props.children;
}

export default Animate;