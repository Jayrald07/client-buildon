import React from 'react';
import './index.css';
import TabBar, { Tab } from '../Tabs/';
import { InfoCircleFilled, PhoneFilled, CloseCircleOutlined } from '@ant-design/icons'
import DonateIcon from '../../../public/icons/hand.svg';
import Input from '../../../assets/Input';

export default class Dialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDonate: false,
            amount: ''
        }
        this.handleDonate = this.handleDonate.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
    }

    handleAmount(amo) {
        this.setState({
            amount: this.state.amount + amo
        })
    }

    handleDonate() {
        fetch('https://107.21.5.198:8080/test', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentMethod: 'paymaya_wallet'
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.action) {
                    location.href = response.action.url
                }
            })

        // this.setState(prevState => {
        //     return {
        //         isDonate: !prevState.isDonate
        //     }
        // })
    }

    render() {
        return (
            <>
                <div className="_buildon-dialog">
                    <section className="_buildon-dialog-panel">
                        <div className="_buildon-dialog-close">
                            <CloseCircleOutlined onClick={this.props.onClose} />
                        </div>
                        <figure className="_buildon-dialog-image" style={{ background: 'url("https://www.who.int/images/default-source/searo---images/countries/bangladesh/sadar-hospital-2019.tmb-479v.png?sfvrsn=d032eb0a_1%20479w")' }}></figure>
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
                        <button onClick={this.handleDonate} className="_buildon-donate"><img src={DonateIcon} style={{ width: "13px" }} /> Donate</button>
                    </section>
                </div>

                <div className="_buildon-dialog" style={{ display: this.state.isDonate ? "grid" : "none" }}>
                    <section className="_buildon-dialog-panel">
                        {/* <div className="_buildon-dialog-close">
                        <CloseCircleOutlined onClick={this.props.onClose} />
                    </div> */}
                        {/* <figure className="_buildon-dialog-image" style={{ background: 'url("https://www.who.int/images/default-source/searo---images/countries/bangladesh/sadar-hospital-2019.tmb-479v.png?sfvrsn=d032eb0a_1%20479w")' }}></figure> */}
                        <section className="_buildon-dialog-details">
                            <TabBar>
                                <Tab title="GCash" icon={<InfoCircleFilled />}>
                                    <h1>Please type your donating amount</h1>
                                    <Input handleValue={this.state.amount} handleChange={(value) => this.handleAmount(value)} type="text" placeholder="Amount" />
                                </Tab>
                                <Tab title="PayMaya" icon={<PhoneFilled />}>
                                    <h1>Contact</h1>
                                </Tab>
                            </TabBar>
                        </section>
                        <button onClick={this.handleDonate} className="_buildon-donate"><CloseCircleOutlined /> Close</button>
                    </section>
                </div>
            </>
        );
    }
}
