import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Button} from 'react-bootstrap';
import './App.css';
import memeHash from './Lab';
import { render } from 'react-dom';

const Dcard = (props) => {
// if true
//     card + Button
//  else  if pending
//    card + Rport pending
   
// else if false 
//     No report assigned
    const statusValue = props.status;
  if (statusValue ==='true') 
  {    
      return (
        <Card className="Dcard card">
        <h5>MedNAME:{props.mName} </h5>
        <h5>Reports:{props.pReport}</h5>
        <h5>PID:{props.status}</h5>
        <a className="btn btnColl" href={`https://ipfs.infura.io/ipfs/${props.pReport}`}>View Reports</a>
        </Card>
     
      );  
    }
    else if(statusValue === 'pending'){
        return (
            <Card className="Dcard card">
            <h5>MedNAME:{props.mName} </h5>
            <h5>Reports:{props.pReport}</h5>
            <h5>PID:{props.status}</h5>
            <a className="btn btn-danger">Reports pending</a>
            </Card>
          );  
    }
    else{
        return (
            <Card className="Dcard card">
            <h5>MedNAME:{props.mName} </h5>
            <h5>Reports:{props.pReport}</h5>
            <h5>PID:{props.status}</h5>
            <a className="btn btn-warning">No Reports</a>
            </Card>
        );
    }
    // return (
    //         <Card className="Dcard card">
    //             <h5>MedNAME:{props.mName} </h5>
    //             <h5>Reports:{props.pReport}</h5>
    //             <h5>PID:{props.status}</h5>
    //             </Card>


           
    // );
};

export default Dcard;