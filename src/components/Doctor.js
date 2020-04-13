import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Accordion, Card, Button } from 'react-bootstrap';
import Form from './Modal';
import './App.css';
import Patients from '../abis/Patients.json';
import Presc from '../abis/Presc.json'

class Doctor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      //  TOGGLE  
      isopen: false,
      isenter: false
    }
  }

  TogglePrev = () => {
    this.setState({
      isopen: !this.state.isopen
    });
  };
  ToggleMed = () => {
    this.setState({
      isenter: !this.state.isenter
    });
  };


  render() {
    return (
      <div>
        <div className="doctainer">
          <div className="row">
            <div className="col-md-8">
              <button className="btn btnops1" onClick={this.TogglePrev}>Previous Data</button>
              <button className="btn btnops2" onClick={this.ToggleMed}>Prescribe Medicines</button>
              {/* Display of Cards */}
              <br />
              <br />
              <br />
              <br />
              {/* Prescribe Card */}
              <Form isenter={this.state.isenter}>
                <div className="DocCard center-block modal-lg">
                  <form>
                    <div className="modal-header">
                      <h3 className="modal-title">Prescribe Med</h3>
                      <button type="button" className="close text-danger" onClick={this.ToggleMed}>&times;</button>
                    </div>
                    <input
                      id="postContent"
                      type="number"
                      className="form-control"
                      placeholder="Enter Patient ID"
                      required />
                    <input
                      id="postContent"
                      type="text"
                      className="form-control"
                      placeholder="Prescribe Medicine"
                      required />
                    <hr />
                    <button type="submit" className="btn btnDoc">Add</button>
                  </form>
                </div>
              </ Form>

              {/* Previous Card */}
              <Form isopen={this.state.isopen}>
                <div className="DocCard center-block modal-lg">
                  <form>
                    <div className="modal-header">
                      <h3 className="modal-title">Patient History</h3>
                      <button type="button" className="close text-danger" onClick={this.TogglePrev}>&times;</button>
                    </div>
                    {/* Its Accordion Bootstrap */}
                    <Accordion className="prevTitle">
                      <Card>
                        <Card.Header>
                          <h4>Report 1</h4>
                          <Accordion.Toggle className="btn btnColl" as={Button} eventKey="0">
                            Click
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>this is report 1</Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <Card.Header>
                          <h4>Report 2</h4>
                          <Accordion.Toggle className="btn btnColl" as={Button} eventKey="1">
                            Click
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                          <Card.Body>this is report 2</Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                    {/* Its Compplicated dont touch this */}
                  </form>
                </div>
              </ Form>
            </div>
            {/* Patient Details */}
            <div className="col-md-4">
              <div className="cardDoc">
                <h2>Patient Details</h2>
                <div className="cardInfo">
                  <Table className="text-dark" bordered >
                    <tbody>
                      <tr>
                        <td>
                          <input
                            id="postContent"
                            type="number"
                            // ref={(input) => { this.UidContent = input }}
                            className="form-control"
                            placeholder="Enter Patient ID"
                            required />
                        </td>
                        <td>
                          <button type="submit" className="btn btn-info" >Get</button>
                        </td>
                      </tr>
                      <tr>    <td>Patient ID:</td><td></td>   </tr>
                      <tr>    <td>Name:</td> <td></td>        </tr>
                      <tr>    <td>Email:</td><td></td>        </tr>
                      <tr>    <td>Blood Group:</td><td></td>  </tr>
                      <tr>    <td>Gender:</td> <td></td>      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Doctor;