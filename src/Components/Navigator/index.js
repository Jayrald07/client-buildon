import React, {useEffect,useState} from 'react';
import './index.css';
import {LoginOutlined,InfoCircleOutlined,HomeOutlined, MenuOutlined} from '@ant-design/icons';
import Animate from '../../../assets/Animate.js'
import {Link, BrowserRouter as Router} from 'react-router-dom';
class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isMenuOpen: false, isClickedLink: false}
        this.alertHandle = this.alertHandle.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    alertHandle() {
        this.setState(prevState => {
            return {
                isMenuOpen: !prevState.isMenuOpen,
                isClickedLink: false
            }
        })
    }

    handleRouteChange() {
        this.setState(prevState => {
            return {
                isClickedLink: !prevState.isClickedLink,
                isMenuOpen: false
            }
        })
    }

    render() {
        return (

        <nav>
            <ul className="_buildon-navigator-top-level">
                <li className="_buildon-navigator-tp-item"><a href="#" className="_buildon-navigator-tp-link">Help Advocates PH</a> <button className="_buildon-navigator-collapser" onClick={this.alertHandle}><MenuOutlined  style={{fontSize:"12pt"}} /></button></li>
            </ul>
            <ul className="_buildon-navigator" style={{display: !this.state.isClickedLink ? "block":"none"}}>
                <Animate delay={100} on={this.state.isMenuOpen}>
                    <li className="_buildon-navigator-item off " ref={React.createRef()}><Link to="/" onClick={this.handleRouteChange} className="_buildon-navigator-link"><HomeOutlined /> Home</Link></li>
                    <li className="_buildon-navigator-item off" ref={React.createRef()}><a href="#" className="_buildon-navigator-link"><InfoCircleOutlined /> News</a></li>
                    <li className="_buildon-navigator-item off" ref={React.createRef()}><Link to="/login" onClick={this.handleRouteChange} className="_buildon-navigator-link"><LoginOutlined /> Login</Link></li>
                </Animate>
            </ul>
        </nav>
        );
    }
}

export default Navigator;