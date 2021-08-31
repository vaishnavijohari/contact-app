import React from 'react';
import { Link } from 'react-router-dom';
import user from '../images/user.jpg';

const ContactDetail = (props) => {
    //const { id, name, email } = props.contact;
    const { name, email } = props.location.state.contact;
    return(
        <div className="main" style={{marginTop: '4em'}}> 
            <div classname="ui card centered">
                <div className="image">
                    <img src={user} alt="user" />
                    <div className="content" style={{marginTop: '1em', marginLeft: '2em'}}>
                        <div className="header">{name}</div>
                        <div className="description">{email}</div>
                    </div>
                </div>
            </div>
            <div className="center-div" style={{marginTop: '1em', marginLeft: '2em'}}>
                <Link to="/"><button className="ui button blue center">Back to Contact List</button></Link>
            </div>
        </div>
        
    );
};

export default ContactDetail;