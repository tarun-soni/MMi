import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card} from 'react-bootstrap';
import './App.css';

const Dcard = (props) => {

    return (
            <Card className="Dcard card">
                <h5>MedNAME:{props.mName} </h5>
                <h5>Reports:{props.pReport}</h5>
                <h5>Report status:{props.status}</h5>
                <button className="btn btnColl">View Reports</button>
            </Card>
    );
};

export default Dcard;