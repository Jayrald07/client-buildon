import React, { useReducer, useState } from 'react';
import './style.css';
import Navigator from './src/Components/Navigator';
import RequestCard from './src/Components/RequestCard'
import Dialog from './src/Components/Dialog';
import Input from './assets/Input.js'
import Button from './assets/Button.js'
import Steps, { StepAction, StepGroup, Step, StepEndButton } from './assets/Steps.js'
import cake from './public/icons/birthday-cake.svg';
import { FacebookButton } from './assets/SocialMediaButton.js'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { LoginOutlined, LoadingOutlined } from '@ant-design/icons';

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isRegistering, setIsRegistering] = useState(false);
    const handleRegister = () => {
        setIsRegistering(true);
        fetch(`http://${process.env.HOST}:${process.env.PORT}/register`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(state)
        })
            .then(response => response.json())
            .then(response => {
                if (response.message === 'username is taken') {
                    setCurrentStep(1);
                    dispatch({ type: 'username', value: state.username.value, error: true })
                }
                setIsRegistering(false)
            })
    }

    const handleRequest = () => {
        setIsDialogOpen(true);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleChangeStep = (type) => {
        setCurrentStep(type === 'inc' ? currentStep + 1 : currentStep - 1)
    }


    return (
        <>
            <Router>
                <Navigator />
                <Switch>
                    <Route exact path="/">
                        <header className="_buildon-header">
                            <h1>Have a bright day by helping our frontliners</h1>
                        </header>
                        <main className="_buildon-main">
                            <h1>Requests</h1>
                            <RequestCard onClick={handleRequest} image="https://live.staticflickr.com/4561/38054606355_26429c884f_b.jpg" title="Barangay 89" city="Caloocan City" needs={['Food', 'Cash', 'PPEs']} />
                            <RequestCard onClick={handleRequest} image="https://www.who.int/images/default-source/searo---images/countries/bangladesh/sadar-hospital-2019.tmb-479v.png?sfvrsn=d032eb0a_1%20479w" title="Barangay 89" city="Caloocan City" needs={['Food', 'Cash', 'PPEs']} />
                        </main>
                        {
                            isDialogOpen ?
                                <Dialog onClose={handleClose} />
                                : null
                        }
                    </Route>
                    <Route exact path="/login" >
                        <section className="_buildon-center-v">
                            <form className="_buildon-form">
                                <label>Username</label>
                                <Input type="text" />
                                <label>Password</label>
                                <Input type="password" />
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
                                            <Input type="file" placeholder="Upload ID" />
                                        </Step>
                                        <Step>
                                            <h1>Review</h1>
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
                        <h1>User</h1>
                    </Route>
                </Switch>
            </Router>
        </>
    );

}

export default App;