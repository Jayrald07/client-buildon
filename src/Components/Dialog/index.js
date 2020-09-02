import React, { useState } from 'react';
import './index.css';
import TabBar, { Tab } from '../Tabs/';
import { InfoCircleFilled, PhoneFilled, CloseCircleOutlined, } from '@ant-design/icons'
import DonateIcon from '../../../public/icons/hand.svg';
import gcash from '../../../public/images/gcash.png';
import paymaya from '../../../public/images/paymaya.png';
import foodpanda from '../../../public/images/foodpanda.png';
import { useCookies } from 'react-cookie';
import Input from '../../../assets/Input';
import Pin from '../../../public/icons/pin.js'


const Dialog = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['pd']);

    const [isDonate, setIsDonate] = useState(false);
    const [amount, setAmount] = useState('');

    const handleDonateNow = (pmethod) => {

        if (pmethod === 'food_panda') {
            navigator.geolocation.getCurrentPosition(loc => {
                location.href = `https://www.foodpanda.ph/restaurants/new?lat=${loc.coords.latitude}&lng=${loc.coords.longitude}&vertical=restaurants`
            })
        } else {
            if (parseInt(amount)) {
                fetch('https://107.21.5.198:8080/test', {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentMethod: pmethod,
                        amount: parseInt(String(amount).concat("00"))
                    })
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.action) {
                            setCookie('alt', 'falsify', { path: '/', sameSite: "lax" })
                            setCookie('pd', response.action.paymentData, { path: '/', sameSite: 'lax' })
                            location.href = response.action.url
                        }
                    })
            } else {
                alert("Invalid amount. Try again.")
            }
        }


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
                                <h1>Contacts</h1>
                            </Tab>
                            <Tab title="Location" icon={<Pin />}>
                                <h1>Address</h1>
                                <small>#181 6th street between 11th and 12th avenue Caloocan City</small>
                                <section className="send-package-panel">
                                    <h1>Send a package?</h1>
                                    <p>
                                        Click for more details
                                        <details>
                                            <summary>Recepient Details</summary>
                                            <p>
                                                lds
                                            </p>
                                        </details>
                                    </p>
                                </section>
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
                            <label className="list-label">Cash</label>
                            <section style={{ padding: "10px 10px 0 10px" }} className="list-also">
                                <small>Enter amount first</small>
                                <Input style={{ marginTop: "5px" }} handleValue={amount} handleChange={value => setAmount(value)} type="number" placeholder="0.00" />
                            </section>
                            <ul>
                                <li onClick={() => handleDonateNow("gcash")} className="fadeLeft"><img src={gcash} /><span>GCash</span></li>
                                <li onClick={() => handleDonateNow("paymaya_wallet")}><img src={paymaya} /><span>PayMaya</span></li>
                                <label className="list-label">Food</label>
                                <li className="list-also" onClick={() => handleDonateNow("food_panda")}><img src={foodpanda} /><span>Food Panda</span></li>
                            </ul>
                        </section>
                    </section>
                </section>
            </div>
        </>
    );
}

export default Dialog