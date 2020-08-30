import React, {useState} from 'react';
import './index.css';

const Tab = (props) => {
    return (
            <li onClick={props.handleChangeTab}>
                {props.icon} {" "}
                {props.title}
            </li>
        );
}

const TabBar = (props) => {

    const [currentTab,setCurrentTab] = useState(React.Children.toArray(props.children)[0].props.children);

    const handleAlert = (component) => {
        setCurrentTab(component)
    }

    return (
            <>
                <section className="_buildon-tab-bar">
                    <ul className="_buildon-tabs">
                        {
                            React.Children.map(props.children,(child,index) => {
                                return React.cloneElement(child,{
                                    handleChangeTab: () => handleAlert(child.props.children),
                                })
                            })
                        }
                    </ul>
                    <section className="_buildon-tab-body">
                        {currentTab}
                    </section>
                </section>
            </>
        );
}

export default TabBar;
export {Tab};