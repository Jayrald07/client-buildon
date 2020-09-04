import React, { useState, useRef } from 'react';
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
import { Map, TileLayer, Marker } from 'react-leaflet';



const Dialog = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['pd']);
    const myCloneMap = useRef();

    const [isDonate, setIsDonate] = useState(false);
    const [amount, setAmount] = useState('');

    const handleDonateNow = (pmethod, request_id) => {

        if (pmethod === 'food_panda') {
            location.href = `https://www.foodpanda.ph/restaurants/new?lat=${props.toShow.lat}&lng=${props.toShow.lng}&vertical=restaurants`
        } else {
            if (parseInt(amount)) {
                fetch('https://107.21.5.198:8080/test', {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentMethod: pmethod,
                        amount: parseInt(String(amount).concat("00")),
                        request_id,
                        token: cookies.token === 'undefined' ? undefined : cookies.token
                    })
                })
                    .then(response => response.json())
                    .then(response => {
                        if (response.message !== 'jwt expired') {
                            if (response.action) {
                                setCookie('alt', 'falsify', { path: '/', sameSite: "lax" })
                                setCookie('pd', response.pd, { path: '/', sameSite: 'lax' })
                                location.href = response.action
                            }
                        } else {
                            alert("Please sign-in first.")
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
                    <figure className="_buildon-dialog-image" style={{ background: `url(${props.toShow.img})`, backgroundSize: "cover" }}></figure>
                    <section className="_buildon-dialog-details">
                        <TabBar>
                            <Tab title="Details" icon={<InfoCircleFilled />}>
                                <h1>Statements</h1>
                                <p className="_buildon-paragraph">
                                    {props.toShow.description}
                                </p>
                                <h1>Primary Needs</h1>
                                <ol className="_buildon-numbered-list">
                                    <li>Food</li>
                                    <li>Cash</li>
                                    <li>PPEs</li>
                                </ol>
                                <h1>Contacts</h1>
                                <small>{props.toShow.contact}</small>
                            </Tab>
                            <Tab title="Location" icon={<Pin />}>
                                <h1>Address</h1>
                                <small>{props.toShow.address}</small>
                                <section className="send-package-panel">
                                    <h1>Send a package?</h1>
                                    <p>
                                        Click for more details
                                        <details className="request-location-details" onClick={() => myCloneMap.current.leafletElement.invalidateSize()}>
                                            <summary>Recepient Details</summary>
                                            <p>
                                                <h1 style={{ fontSize: "10pt" }}>Receiver</h1>
                                                <small style={{ fontSize: "9pt", display: "block", marginBottom: "10px" }}>{props.toShow.receiver}</small>
                                                <h1 style={{ fontSize: "10pt" }}>Coords</h1>
                                                <small style={{ fontSize: "9pt", display: "block", marginBottom: "10px" }}>Lat: {props.toShow.lat}<br />Lng: {props.toShow.lng}</small>
                                                <Map ref={myCloneMap} center={[props.toShow.lat, props.toShow.lng]} zoom={15}>
                                                    <TileLayer
                                                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                    <Marker position={[props.toShow.lat, props.toShow.lng]} />
                                                </Map>
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
                                <li onClick={() => handleDonateNow("gcash", props.toShow._id)} className="fadeLeft"><img src={gcash} /><span>GCash</span></li>
                                <li onClick={() => handleDonateNow("paymaya_wallet", props.toShow._id)}><img src={paymaya} /><span>PayMaya</span></li>
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