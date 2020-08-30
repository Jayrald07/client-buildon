import React, {useContext,useState} from 'react';

const StepContext = React.createContext(1);

const StepAction = props => {
    const contextValue = useContext(StepContext);
    
    
    return <div className="_buildon-step-action">
            {
                React.Children.map(props.children,(child,index) => {
                        return React.cloneElement(child,{
                            style: {
                                display: contextValue === 1
                                    ? 
                                        index === 1 ?
                                            "block"
                                        : "none"
                                    : contextValue === 2
                                        ?
                                            index === 0 || index === 1 ?
                                                "block"
                                            : "none"
                                        : contextValue === 3 ?
                                            index === 0 || index === 2 ?
                                                "block"
                                            : "none"
                                        : "none"
                                        
                                    
                            }
                        })
                })
            }
        </div>
}

const StepGroup = props => {
    const contextValue = useContext(StepContext);
    
    const stepBar = React.Children.map(props.children, (child,index) => {
        
        let stepCircle = "_buildon-step-indicator", 
        stepLine = "_buildon-step-line";
        
        
        return <>
            <div className={stepCircle}>{index + 1}</div>
            {
                React.Children.count(props.children) !== index + 1 ?
                    <div className={stepLine}></div> 
                : null
            }
        </>
    })
    
    return (
        <>
            <div className="_buildon-step-container">
                {stepBar}
            </div>
            {
                React.Children.map(props.children,(child,index) => {
                    return React.cloneElement(child,{
                        isOn: contextValue === index + 1 ? true : false
                    });
                })
            }
        </>
    )
}

const Step = props => {
    return (
        <section style={{display:props.isOn ? "block":"none"}}>
            {
                props.children
            }
        </section>
    )
}

const Steps = (props) => {
    
    return (
        <StepContext.Provider value={props.currentStep}>
            <div className="_buildon-center-v">
                <section className="_buildon-steps">
                    {
                        props.children
                    }
                </section>
            </div>
        </StepContext.Provider>
    );
}

export default Steps;
export {
    Step,
    StepGroup,
    StepAction,
};