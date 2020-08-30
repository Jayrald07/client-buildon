import React from 'react';
import './index.css'
import Badge from '../../../assets/Badge.js'

class RequestCard extends React.Component {
    render() {
        const { image,title, city, needs, onClick } = this.props;
        return (
                <section className="_buildon-request-card" onClick={onClick}>
                    <img src={image} width="100" height="100"/>
                    <section>
                        <h1>{title}</h1>
                        <small>{city}</small>
                        <h2>Need/s:</h2>
                        {
                            needs.map(item => {
                                return <Badge key={item}>{item}</Badge>;
                            })
                        }
                    </section>
                </section>
            );
    }
}

export default RequestCard;