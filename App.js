import React, { useReducer, useState, useEffect, useRef, useContext } from 'react';
import Navigator from './src/Components/Navigator';
import RequestCard from './src/Components/RequestCard'
import Dialog from './src/Components/Dialog';
import Input from './assets/Input.js'
import Button from './assets/Button.js'
import Steps, { StepAction, StepGroup, Step, StepEndButton } from './assets/Steps.js'
import cake from './public/icons/birthday-cake.svg';
import { FacebookButton } from './assets/SocialMediaButton.js'
import { BrowserRouter as Router, Route, Switch, Link, useParams, useLocation } from 'react-router-dom';
import { InfoCircleFilled, PhoneFilled, DeleteOutlined, CloseCircleOutlined, AimOutlined, LoginOutlined, LoadingOutlined, PlusCircleOutlined, CameraOutlined, CheckOutlined, CloseCircleFilled } from '@ant-design/icons';
import Badge from './assets/Badge.js';
import { useCookies, withCookies } from 'react-cookie';
import { Map, TileLayer, Marker } from 'react-leaflet';
import './style.css';

const reducerFunction = (state, action) => {
    switch (action.type) {
        case 'job':
            return { ...state, job: { value: action.value, error: action.error || false } };
        case 'last_name':
            return { ...state, last_name: { value: action.value, error: false } };
        case 'first_name':
            return { ...state, first_name: { value: action.value, error: false } };
        case 'middle_name':
            return { ...state, middle_name: { value: action.value, error: false } };
        case 'birthday':
            return { ...state, birthday: { value: action.value, error: false } };
        case 'username':
            return { ...state, username: { value: action.value, error: action.error || false } };
        case 'password':
            return { ...state, password: { value: action.value, error: false } };
    }
}

const requestReducer = (state, action) => {
    switch (action.type) {
        case 'title':
            return { ...state, title: action.value }
        case 'description':
            return { ...state, description: action.value }
        case 'city':
            return { ...state, city: action.value }
        case 'needs':
            return { ...state, needs: action.value }
        case 'contact':
            return { ...state, contact: action.value }
        case 'address':
            return { ...state, address: action.value }
        case 'receiver':
            return { ...state, receiver: action.value }

        default:
            break;
    }
}

const App = (props) => {
    const [state, dispatch] = useReducer(reducerFunction, {
        job: { value: '', error: false },
        last_name: { value: '', error: false },
        first_name: { value: '', error: false },
        middle_name: { value: '', error: false },
        birthday: { value: '', error: false },
        username: { value: '', error: false },
        password: { value: '', error: false }
    });
    const [reqState, reqDispatch] = useReducer(requestReducer, {
        title: '',
        description: '',
        city: '',
        needs: '',
        contact: '',
        address: '',
        receiver: ''
    })
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginUname, setLoginUname] = useState('');
    const [loginUpass, setLoginUpass] = useState('');
    const [uploadedID, setUploadedID] = useState('');
    const myIDref = useRef();
    const myReqRef = useRef();
    const myMapRef = useRef();
    const [reqPic, setReqPic] = useState('');
    const [isTakePic, setIsTakePic] = useState(false);
    const [isSnapped, setIsSnapped] = useState(false);
    const [takenPicture, setTakenPicture] = useState('');
    const [toggleRegister, setToggleRegister] = useState(false);
    const [userData, setUserData] = useState({});
    const [isLegitAccount, setIsLegitAccount] = useState(false);
    const [centerPos, setCenterPos] = useState([14.653903, 120.988914]);
    const [zoomMap, setZoomMap] = useState(15);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isRequest, setIsRequest] = useState(false)
    const [userRequests, setUserRequest] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [currentRequest, setCurrentRequest] = useState([]);
    const [isCurrentReq, setIsCurrentReq] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState('');
    const [isFetchinReqs, setIsFetchingReqs] = useState(true);

    const handleRegister = () => {
        const { job, first_name, last_name, middle_name, birthday, username, password } = state;
        if (job.value.trim() && first_name.value.trim() && last_name.value.trim() && middle_name.value.trim() && birthday.value.trim() && username.value.trim() && password.value.trim() && takenPicture.trim() && myIDref.current.files.length) {
            setIsRegistering(true);
            const formData = new FormData();

            function dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            }

            var file = dataURLtoFile(takenPicture, 'source.png');

            formData.append('job', state.job.value);
            formData.append('first_name', state.first_name.value);
            formData.append('last_name', state.last_name.value);
            formData.append('middle_name', state.middle_name.value);
            formData.append('birthday', state.birthday.value);
            formData.append('username', state.username.value);
            formData.append('password', state.password.value);
            formData.append('source', file);
            formData.append('target', myIDref.current.files[0]);

            fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/register`, {
                method: "post",
                body: formData
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setToggleRegister(false)
                    if (response.message === "username is taken") {
                        setCurrentStep(1);
                        setIsRegistering(false)
                        dispatch({ type: 'username', value: state.username.value, error: true });
                    } else if (response.message === "registered") {
                        setCookie('token', response.token, { path: '/', sameSite: 'lax' })
                        location.href = "/user"
                    } else if (response.message === "Face not match") {
                        alert('Face not match. Try Again.');
                        setIsRegistering(false)
                    }
                })
        } else {
            alert("Please complete all the credentials needed");
        }
    }

    const handleRequest = (order) => {
        console.log(order, allRequests[order])
        setSelectedRequest(allRequests[order]);
        setIsDialogOpen(true);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleChangeStep = (type) => {
        setCurrentStep(type === 'inc' ? currentStep + 1 : currentStep - 1)
    }

    const handleLogin = (e) => {
        if (e) {
            e.preventDefault();
        }
        fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/validate`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uname: loginUname,
                upass: loginUpass,
                token: cookies.token === 'undefined' ? undefined : cookies.token
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.message === 'found') {
                    setCookie('token', response.token, { path: '/', sameSite: 'lax' })
                    location.href = "/user"
                } else if (response.message === 'no record') {
                    alert("Username/Password is incorrect")
                } else if (response.message === 'jwt expired') {
                    removeCookie('token');
                    handleLogin()
                }
            })
            .catch(error => console.log(error))
    }

    const takeASnap = (type) => {
        let canvas = document.querySelector("#cv");
        let contxt = canvas.getContext("2d");
        if (type !== 'select' && type !== 'close') {
            // if (window.localStream)
            //     window.localStream.getVideoTracks()[0].stop();

            if (type === 'open' || isSnapped) {
                setIsTakePic(true)
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function (stream) {
                        let video = document.querySelector('#vid');
                        window.localStream = stream;
                        if ("srcObject" in video) {
                            video.srcObject = stream;
                        } else {
                            video.src = window.URL.createObjectURL(stream);
                        }
                        video.onloadedmetadata = function (e) {
                            video.play();
                        };

                        setInterval(() => {
                            canvas.height = video.videoHeight;
                            canvas.width = video.videoWidth;
                            contxt.drawImage(video, 0, 0);
                        }, 60);

                        setIsSnapped(false)

                    })

            } else {
                if (!isSnapped) vid.pause();
                setIsSnapped(!isSnapped)
            }
        } else if (type === 'close') {
            if (window.localStream) {
                window.localStream.getVideoTracks()[0].stop();
            }
            setIsTakePic(false);
            setIsSnapped(false)
        } else {
            if (isSnapped) {
                const a = canvas.toDataURL("image/jpeg", 1.0);
                window.localStream.getVideoTracks()[0].stop();
                setIsTakePic(false);
                setIsSnapped(false);
                setTakenPicture(a);
            } else {
                alert('Please Snap first')
            }
        }

    }

    const getCredentials = (tkn) => {
        fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/credentials`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: tkn ? tkn : cookies.token === 'undefined' ? undefined : cookies.token
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.message === 'jwt expired') {
                    removeCookie('token');
                } else {
                    setUserData(response.userData)
                    setUserRequest(response.requests);
                }
            })
    }

    const centralized = () => {
        const { lat, lng } = myMapRef.current.leafletElement.getBounds().getCenter();
        setCenterPos([lat, lng]);
    }

    const calibratePos = () => {
        navigator.geolocation.getCurrentPosition(e => {
            const { latitude, longitude } = e.coords;

            setCenterPos([latitude, longitude]);
        })
    }

    const getAllRequest = () => {
        fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/requests/all`)
            .then(response => response.json())
            .then(response => {
                if (response.message === 'got') {
                    setIsFetchingReqs(false)
                    setAllRequests(response.reqs);
                } else if (response.message === 'none') {
                    // show none
                }
            })
    }

    const addRequest = () => {
        setIsPublishing(true);

        const requestFormData = new FormData();

        const { title, description, city, needs, contact, address, receiver } = reqState;

        if (title.trim() && description.trim() && city.trim() && needs.trim() && contact.trim() && address.trim() && centerPos[0] && centerPos[1] && cookies.token && myReqRef.current.files.length === 1) {
            requestFormData.append('token', cookies.token);
            requestFormData.append('title', title);
            requestFormData.append('description', description);
            requestFormData.append('city', city);
            requestFormData.append('needs', needs);
            requestFormData.append('im', myReqRef.current.files[0]);
            requestFormData.append('contact', contact);
            requestFormData.append('receiver', receiver);
            requestFormData.append('address', address);
            requestFormData.append('lat', centerPos[0]);
            requestFormData.append('lng', centerPos[1]);

            fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/request`, {
                method: "post",
                body: requestFormData
            })
                .then(response => response.json())
                .then(response => {
                    setIsPublishing(false);
                    if (response.message === 'request-exceed') {
                        alert("Requests limit reached (5/5)");
                    } else {
                        setIsRequest(false);
                        getCredentials();
                    }
                })
        } else {
            alert("Please complete all fields");
            setIsPublishing(false);
        }

    }

    const deleteReq = (order) => {
        fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/request/delete`, {
            method: "delete",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                reqID: userRequests[order]._id
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.message === 'deleted') {
                    getCredentials();
                }
            })
    }

    const openRequest = (order) => {
        setIsCurrentReq(true);
        setCurrentRequest([userRequests[order]]);
    }

    useEffect(() => {

        let search = {
            payload: '',
            type: '',
            resultCode: ''
        };

        if (location.search) {
            location.search.split("?")[1].split("&").forEach(item => {
                search[item.split("=")[0]] = item.split("=")[1]
            });
        }

        if (search.resultCode === 'authorised') {
            if (cookies.alt === 'falsify') {
                alert("Donated!");
                removeCookie('alt');
            }
        }


        fetch(`https://${process.env.HOST_S}:${process.env.PORT_S}/user`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: cookies.token === 'undefined' ? undefined : cookies.token
            })
        })
            .then(response => response.json())
            .then(response => {
                if (location.pathname === '/') getAllRequest()

                if (response.message === 'logged') {
                    setCookie('token', response.token, { path: '/', sameSite: 'lax' });
                    getCredentials(response.token);
                    setIsLegitAccount(true)
                } else if (response.message === 'good') {
                    setIsLegitAccount(true)
                    if (location.pathname === '/login' || location.pathname === '/login/' || location.pathname === '/register' || location.pathname === '/register/') {
                        location.href = "/user"
                    } else if (location.pathname === '/user' || location.pathname === '/user/') {
                        getCredentials()
                    }
                } else if (response.message === "jwt expired" || response.message === "login first") {
                    removeCookie('token');
                    if (location.pathname === '/user' || location.pathname === '/user/') {
                        location.href = "/login"
                    }
                }
            })
    }, []);

    return (
        <>
            <Router>
                <Navigator isLogged={isLegitAccount} onLogout={() => removeCookie('token')} />
                <Switch>
                    <Route exact path="/">
                        <header className="_buildon-header">
                            <h1>Have a bright day by helping our frontliners</h1>
                        </header>
                        <main className="_buildon-main">
                            <h1>Requests</h1>
                            {
                                isFetchinReqs ?
                                    <div className="_buildon-center-v" style={{ height: "10vh" }}>
                                        <LoadingOutlined />
                                    </div>
                                    : allRequests.length ?
                                        allRequests.map((item, i) => {
                                            return <RequestCard onClick={() => handleRequest(i)} image={item.img} title={item.title} city={item.city} needs={['Food', 'Cash', 'PPEs']} />

                                        })

                                        : <small>No Requests</small>
                            }
                            {/* <RequestCard onClick={handleRequest} image="https://www.who.int/images/default-source/searo---images/countries/bangladesh/sadar-hospital-2019.tmb-479v.png?sfvrsn=d032eb0a_1%20479w" title="Barangay 89" city="Caloocan City" needs={['Food', 'Cash', 'PPEs']} /> */}
                        </main>
                        {
                            isDialogOpen ?
                                <Dialog onClose={handleClose} toShow={selectedRequest} />
                                : null
                        }
                    </Route>
                    <Route exact path="/login" >
                        <section className="_buildon-center-v">
                            <form className="_buildon-form" onSubmit={handleLogin}>
                                <label>Username</label>
                                <Input handleValue={loginUname} handleChange={value => setLoginUname(value)} type="text" name="uname" required />
                                <label>Password</label>
                                <Input handleValue={loginUpass} handleChange={value => setLoginUpass(value)} type="password" name="upass" />
                                <Button><LoginOutlined /> Login</Button>
                                <Link to="/register" className="_buildon-create-account">Create Account</Link>
                                <div className="_buildon-text-divider">
                                    <span>
                                        or
                                    </span>
                                </div>
                            </form>
                            <FacebookButton />
                        </section>
                    </Route>
                    <Route exact path="/register">
                        {
                            !isRegistering ?
                                <Steps currentStep={currentStep}>
                                    <StepGroup>
                                        <Step>
                                            <h1>Basic Profile</h1>
                                            <Input handleValue={state.job.value} handleChange={(value) => dispatch({ type: 'job', value })} type="text" placeholder="Job" />
                                            <Input handleValue={state.last_name.value} handleChange={(value) => dispatch({ type: 'last_name', value })} type="text" placeholder="Last Name" />
                                            <Input handleValue={state.first_name.value} handleChange={(value) => dispatch({ type: 'first_name', value })} type="text" placeholder="First Name" />
                                            <Input handleValue={state.middle_name.value} handleChange={(value) => dispatch({ type: 'middle_name', value })} type="text" placeholder="Middle Name" />
                                            <Input handleValue={state.birthday.value} handleChange={(value) => dispatch({ type: 'birthday', value })} type="date" placeholder="Job" postIcon={<img src={cake} />} />
                                            <Input error={state.username.error.toString()} handleValue={state.username.value} handleChange={(value) => dispatch({ type: 'username', value })} type="text" placeholder="Username" />
                                            <Input handleValue={state.password.value} handleChange={(value) => dispatch({ type: 'password', value })} type="password" placeholder="Password" />
                                        </Step>
                                        <Step>
                                            <h1>Identity Validation</h1>
                                            <h2 style={{ fontSize: "11pt" }}>Procedure:</h2>
                                            <small>1. Upload valid ID</small>
                                            <section style={{ marginTop: "5px" }}>
                                                <div className="uploaded-image">
                                                    {
                                                        uploadedID && toggleRegister ?
                                                            <img src={URL.createObjectURL(myIDref.current.files[0])} />
                                                            : null
                                                    }
                                                </div>
                                                {/* <input ref={myIDref} onChange={(e) => setUploadedID(e.target.value)} type="file" placeholder="Upload ID" /> */}
                                                <Input handleValue={!toggleRegister ? "" : uploadedID} forRef={myIDref} handleChange={(value) => { setUploadedID(value); setToggleRegister(true) }} type="file" placeholder="Upload ID" />
                                            </section>
                                            <small >2. Take a picture <br /><b>Note: </b>The taken picture will not be subjected to be your profile picture.</small>
                                            <section>
                                                <div className="uploaded-image">
                                                    {
                                                        takenPicture ?
                                                            <img src={takenPicture} id="canver" />
                                                            : null
                                                    }
                                                </div>
                                                <button className="_buildon-step-snappic" onClick={() => takeASnap('open')}><CameraOutlined /></button>
                                            </section>

                                            <div className="_buildon-take-pic" style={{ display: isTakePic ? "flex" : "none" }}>
                                                <div className="_buildon-pic-panel">
                                                    <section className="_buildon-pic-panel-action">
                                                        <CloseCircleFilled onClick={() => takeASnap('close')} />
                                                    </section>
                                                    <section style={{ padding: "20px 40px" }}>
                                                        <section style={{ width: "90%", padding: "10px", textAlign: "justify" }}>
                                                            <small><b>Instruction: </b><br /><i>Click "Snap" to take a picture, and click "Select" once finished. If you want to change the previous taken picture, click "Snap" again</i></small>
                                                        </section>
                                                        <video id="vid" style={{ display: "none", width: "90%", height: 'auto' }}></video>
                                                        <canvas id="cv" style={{ marginTop: "10px", width: "50%", height: 'auto' }}></canvas>
                                                        <section style={{ display: "flex", marginTop: "10px" }}>
                                                            <button className="_buildon-step-button" onClick={() => takeASnap()}><CameraOutlined /> Snap</button>
                                                            <button className="_buildon-step-button outlined" onClick={() => takeASnap('select')}><CheckOutlined /> Select</button>
                                                        </section>
                                                    </section>
                                                </div>
                                            </div>


                                        </Step>
                                        <Step>
                                            <h1>Review</h1>
                                            <section className="review-panel">
                                                <h1>Job: </h1><small>{state.job.value}</small><br />
                                                <h1>Full Name: </h1><small>{`${state.first_name.value} ${state.middle_name.value} ${state.last_name.value}`}</small><br />
                                                <h1>Birthday: </h1><small>{state.birthday.value}</small><br />
                                                <h1>Username: </h1><small>{state.username.value}</small><br />
                                                <h1>Password: </h1><small>[Please remember your password]</small>
                                            </section>
                                        </Step>
                                    </StepGroup>
                                    <StepAction>
                                        <button className="_buildon-step-button" onClick={() => handleChangeStep('dec')}>Back</button>
                                        <button className="_buildon-step-button" onClick={() => handleChangeStep('inc')}>Next</button>
                                        <button onClick={handleRegister} className="_buildon-button _buildon-step-end-button">Register</button>
                                    </StepAction>
                                </Steps>

                                :
                                <div className="_buildon-center-v">
                                    <LoadingOutlined style={{ fontSize: "20pt", color: "#1d6ec9" }} />
                                </div>
                        }
                    </Route>
                    <Route exact path="/user">
                        {/* <h1>User</h1> */}
                        <div className="user-header">
                            <img src="https://live.staticflickr.com/4561/38054606355_26429c884f_b.jpg" />
                            <section>
                                <h1>{userData._id ? `${userData.last_name}, ${userData.first_name} ${userData.middle_name}` : "-"}</h1>
                                <Badge>
                                    {
                                        userData._id ? `${userData.job}` : "-"
                                    }
                                </Badge>

                            </section>
                        </div>
                        <div className="padding-even">
                            <div className="_buildon-note">
                                <p>
                                    <b>Note: </b><i>Just click a certain request to view the details</i>
                                </p>
                            </div>
                            <section className="_buildon-user-panel">
                                <div className="_buildon-user-panel-title">
                                    <h1>Requests</h1>
                                    <PlusCircleOutlined onClick={() => setIsRequest(true)} />
                                </div>
                                <div className="_buildon-user-panel-content">
                                    <ul>
                                        {
                                            userRequests.length ?
                                                userRequests.map((request, i) => {
                                                    return <li onClick={() => openRequest(i)}><span>{new Date(request.date_equested).toLocaleString()}</span> <DeleteOutlined onClick={() => deleteReq(i)} /></li>
                                                })
                                                : null
                                        }
                                    </ul>
                                </div>
                            </section>
                        </div>

                        <div className="request-add-dialog" style={{ display: isRequest ? "grid" : isCurrentReq ? "grid" : "none" }}>
                            <div className={isRequest ? "request-add-panel request-on" : isCurrentReq ? "request-add-panel request-on" : "none"}>
                                <div className="request-add-action">
                                    <CloseCircleOutlined onClick={() => { setIsRequest(false); setIsCurrentReq(false) }} />
                                </div>
                                <div style={{ padding: "10px" }}>
                                    {
                                        isRequest ?
                                            <img src={reqPic ? URL.createObjectURL(myReqRef.current.files[0]) : null} />
                                            : isCurrentReq ?
                                                <img src={currentRequest[0].img} />
                                                : null
                                    }
                                    <label>Upload Picture <br /><small><b>Note: </b>use request-related picture</small></label>
                                    <Input disabled={isCurrentReq ? true : false} handleValue={reqPic} forRef={myReqRef} handleChange={(value) => setReqPic(value)} type="file" />
                                    <label>Title</label>
                                    <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].title : reqState.title} handleChange={value => reqDispatch({ type: 'title', value })} type="text" placeholder="" />
                                    <label>Description</label>
                                    <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].description : reqState.description} handleChange={value => reqDispatch({ type: 'description', value })} type="text" placeholder="" />
                                    <label>City</label>
                                    <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].city : reqState.city} handleChange={value => reqDispatch({ type: 'city', value })} type="text" placeholder="" />
                                    <label>Needs</label>
                                    <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].needs : reqState.needs} handleChange={value => reqDispatch({ type: 'needs', value })} type="text" placeholder="" />
                                    <label>Contact Number</label>
                                    <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].contact : reqState.contact} handleChange={value => reqDispatch({ type: 'contact', value })} type="number" />
                                    <details>
                                        <summary>Location</summary>
                                        <section>
                                            <small><b>Note: </b>These fields will be used for informing the donator if they ever deliver a food or a package</small>
                                            <label><b>Address</b></label>
                                            <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].address : reqState.address} handleChange={value => reqDispatch({ type: 'address', value })} type="text" />
                                            <label><b>Receiver</b></label>
                                            <Input disabled={isCurrentReq ? true : false} handleValue={isCurrentReq ? currentRequest[0].receiver : reqState.receiver} handleChange={value => reqDispatch({ type: 'receiver', value })} type="text" />
                                            <label><b>Calibrate Position</b></label>
                                            <section className="map-info">
                                                <small>Coordinates: <br />Lat: {isCurrentReq ? currentRequest[0].lat : centerPos[0]}<br />Lng: {isCurrentReq ? currentRequest[0].lng : centerPos[1]}</small>
                                                <AimOutlined onClick={calibratePos} />
                                            </section>
                                            <Map ref={myMapRef} onViewportChange={e => { setZoomMap(e.zoom); centralized() }} onmove={centralized} center={isCurrentReq ? [currentRequest[0].lat, currentRequest[0].lng] : centerPos} zoom={zoomMap}>
                                                <TileLayer
                                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <Marker position={isCurrentReq ? [currentRequest[0].lat, currentRequest[0].lng] : centerPos} />
                                            </Map>
                                        </section>
                                    </details>
                                    {
                                        isRequest ?
                                            <button onClick={addRequest} disabled={isPublishing} className="request-add-button">Publish</button>
                                            : isCurrentReq ?
                                                null
                                                : null
                                    }
                                </div>
                            </div>
                        </div>
                    </Route>
                </Switch>
            </Router>
        </>
    );

}

export default App;