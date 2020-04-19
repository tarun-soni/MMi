import React from 'react';
import coverPic from './coverPic.jpg';
import Nav from './Nav';
import Doctor from './Doctor';
import Patient from './Patient';
import {BrowserRouter as Routers, Switch, Route} from 'react-router-dom';

import './App.css';
import Lab from './Lab';

function choice() {
  return (
    <Routers>
    <div className="App">
      <Nav />
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/Doctor" exact component={Doctor} />
      <Route path="/Patient" exact component={Patient} />
      <Route path="/Lab" exact component={Lab} />
      </Switch>
    </div>
    </Routers>
  );
}

const Home = () => (
  <div>
    <h1>Maintaining Medical Informatics</h1>
    <h5>Covid-19 Preventive Measures</h5>
    <div className="formBorder1 container-fluid mt-5">
        <img src={coverPic} />
        {/* <iframe src={`https://www.trackcorona.live/map`} height="300" width="590" ></iframe> */}
      </div>
    </div>
  
);

export default choice;