

import React from 'react';
import './index.css';
import TabBar, {Tab} from '../Tabs/';
import { InfoCircleFilled, PhoneFilled, CloseCircleOutlined } from '@ant-design/icons'
import DonateIcon from '../../../public/icons/hand.svg';

export default class Dialog extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
                <div className="_buildon-dialog">
                    <section className="_buildon-dialog-panel">
                        <div className="_buildon-dialog-close">
                            <CloseCircleOutlined onClick={this.props.onClose} />
                        </div>
                        <figure className="_buildon-dialog-image" style={{background: 'url("https://www.who.int/images/default-source/searo---images/countries/bangladesh/sadar-hospital-2019.tmb-479v.png?sfvrsn=d032eb0a_1%20479w")'}}></figure>
                        <section className="_buildon-dialog-details">
                            <TabBar>
                                <Tab title="Details" icon={<InfoCircleFilled />}>
                                    <h1>Statements</h1>
                                    <p className="_buildon-paragraph">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quam est, scelerisque in eros non, tincidunt dictum diam.
                                    </p>
                                    <h1>Primary Needs</h1>
                                    <ol className="_buildon-numbered-list">
                                        <li>Food</li>
                                        <li>Cash</li>
                                        <li>PPEs</li>
                                    </ol>
                                </Tab>
                                <Tab title="Contact" icon={<PhoneFilled />}>
                                    <h1>Contact</h1>
                                </Tab>
                            </TabBar>
                        </section>
                        <button className="_buildon-donate"><img src={DonateIcon} style={{width:"13px"}}/> Donate</button>
                    </section>
                </div>
            );
    }
}
