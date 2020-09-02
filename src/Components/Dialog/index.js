import React, { useState } from 'react';
import './index.css';
import TabBar, { Tab } from '../Tabs/';
import { InfoCircleFilled, PhoneFilled, CloseCircleOutlined } from '@ant-design/icons'
import DonateIcon from '../../../public/icons/hand.svg';
import gcash from '../../../public/images/gcash.png';
import paymaya from '../../../public/images/paymaya.png';
import { useCookies } from 'react-cookie';


const Dialog = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['pd']);

    const [isDonate, setIsDonate] = useState(false);
    const [amount, setAmount] = useState('');

    const handleAmount = (amo) => {
        setAmount(amo)
    }

    const handleDonateNow = () => {
        fetch('https://107.21.5.198:8080/test', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentMethod: 'gcash',
                amount: 10000
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.action) {
                    setCookie('pd', response.action.paymentData, { path: '/', sameSite: 'lax' })
                    location.href = response.action.url
                }
            })
    }

    const handleDonate = () => {
        setIsDonate(!isDonate)
    }

    return (
        <>
            <div className="_buildon-dialog">
                <section className="_buildon-dialog-panel">
                    <div className="_buildon-dialog-close">
                        <CloseCircleOutlined onClick={props.onClose} />
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
                    <button onClick={handleDonate} className="_buildon-donate"><img src={DonateIcon} style={{ width: "13px" }} /> Donate</button>
                </section>
            </div>

            <div className="_buildon-dialog" style={{ display: isDonate ? "grid" : "none" }}>
                <section className="_buildon-dialog-panel" style={{ width: "70%" }}>
                    <div className="_buildon-dialog-close" style={{ float: "none", background: 'linear-gradient(to right,#1ca7ec,#1f2f98)' }}>
                        <CloseCircleOutlined onClick={handleDonate} />
                    </div>
                    <section className="_buildon-dialog-details">
                        <section className="_buildon-donate-panel">
                            <ul>
                                <li onClick={handleDonateNow} className="fadeLeft"><img src={gcash} /><span>GCash</span></li>
                                <li><img src={paymaya} /><span>PayMaya</span></li>
                            </ul>
                        </section>
                    </section>
                </section>
            </div>
        </>
    );
}

export default Dialog