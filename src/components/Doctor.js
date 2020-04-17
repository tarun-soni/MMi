import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Accordion, Card, Button } from 'react-bootstrap';
import Form from './Modal';
import './App.css';
import Patients from '../abis/Patients.json';
import Presc from '../abis/Presc.json'
import Web3 from 'web3';
import { ControlLabel } from 'react-bootstrap';

class Doctor extends React.Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Patients.networks[networkId]
    const DoctorNetworkData = Presc.networks[networkId]
    if (networkData) {
      const contract = web3.eth.Contract(Patients.abi, networkData.address)
      this.setState({ contract })
    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
    if (DoctorNetworkData) {
      const DoctorContract = web3.eth.Contract(Presc.abi, DoctorNetworkData.address)
      this.setState({ DoctorContract })
    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
    console.log('current logged in account ', this.state.account)
  }
  async GetPatientStaticData() {
    await this.loadBlockchainData()
  
  //getting id from BC
    const displayingUid = await this.state.contract.methods.getPatientId(this.state._id).call()
    const convertedId = displayingUid.toNumber()
    this.setState({ convertedId })
    console.log('Id binded to patient is', convertedId)
  //getting Patients static data from BC
    const showPatients = await this.state.contract.methods.getPatient(this.state._id).call()
    this.setState({ showPatients })
    
     //  this.setState({   showPatients: [...this.state.showPatients, showPatients]})
    
  /*
      console.log('disp email:::::   ', this.state.showPatients[1])
      console.log('show name::::: ', this.state.showPatients[2])
      console.log('show bg:::::  ', this.state.showPatients[3])
      console.log('show gender::::', this.state.showPatients[4])
      console.log('show address::::: ', this.state.showPatients[5])
    */

  }


  async GetPatientDynamicData(){
   await this.loadBlockchainData()
   //getting prev records of patients
    const MedData = await this.state.DoctorContract.methods.getData(this.state._showPresInput).call();
    console.log('ID', MedData[0].toNumber())

    console.log('MedData', MedData[1])

    console.log('reqreport', MedData[2])

    console.log('isresolved', MedData[3])
  }

//normal methods of get which calls thier respective async functions 
  getStaticData = () => {
    this.loadBlockchainData()
     this.GetPatientStaticData()
  };

  getDynamicData = () => {
    console.log("in get Dynamic",this.state._showPresInput)
    this.loadBlockchainData()
    this.GetPatientDynamicData()

  };

  prescribeMedicineButton = () => {
    this.loadBlockchainData()
    console.log('in PrescribeMedicineButton')
    console.log('PresID state', this.state._presid)
  }

  Uid(Uid) {
    this.setState({ _id: Uid })
    console.log('Uid state', this.state._id)
  }

  PresID(PresID) {
    this.setState({ _presid: PresID })
  }
  Medinput(Medinput) {
    this.setState({ _medInput: Medinput })
  }
  ShowPresInput(ShowPresInput){
    this.setState({_showPresInput: ShowPresInput})
  }
  
  constructor(props) {
    super(props)
    this.state = {

      // VALUES NEEDED FOR CONTRACT   
      contract: null,
      DoctorContract: null,  // stores value of contracts
      web3: null,
      account: null, // stores value of logged in account

      //  TOGGLE  
      isopen: false,
      isenter: false,

      //input during get data
      _id: '',  
      _presid: '',    // patient id  inputwhen prescribing
      _medInput:'',   // medicine  input when prescribing
      _showPresInput:'',  // patient id input when geting prev records

      //  STORES VALUE BY GETIING DATA FROM BC & DISPLAYING
      showPatients: [],
      convertedId: '',
    }

    this.Uid = this.Uid.bind(this);
    this.PresID = this.PresID.bind(this);
    this.Medinput = this.Medinput.bind(this)
    this.ShowPresInput = this.ShowPresInput.bind(this)
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
              <Form isenter={this.state.isenter} >

                <div className="DocCard center-block modal-lg">
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const PresID = this.PresIDidContent.value
                    this.PresID(PresID)
                    const Medinput = this.MedContent.value
                    this.Medinput(Medinput)    
                  }}>
                    <div className="modal-header">
                      <h3 className="modal-title">Prescribe Med</h3>
                      <button type="button" className="close text-danger" onClick={this.ToggleMed}>&times;</button>
                    </div>
                    <input
                      id="postContent"
                      type="number"
                      className="form-control"
                      placeholder="Enter Patient ID"
                      ref={(input) => { this.PresIDidContent = input }}
                      required />
                    <input
                      id="postContent"
                      type="text"
                      className="form-control"
                      placeholder="Prescribe Medicine"
                    ref={(input) => { this.MedContent = input }}
                    />
                    <hr />
                    <button type = "submit" className="btn btnDoc" >Save Info</button>
                    <button type = "submit" className="btn btnDoc" onClick={(event) => {
                      console.log(this.state._presid)
                      this.state.DoctorContract.methods.addMed(this.state._presid, this.state._medInput,"")
                        .send({ from: this.state.account }).then((r) => {
                          return this.setState({
                            _presid: this.state._presid
                          })
                        })
                    }
                    }>Add</button>
                  </form>
                </div>
              </ Form>

              {/* Previous Card */}
              <Form isopen={this.state.isopen}>
                <div className="DocCard center-block modal-lg">
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const ShowPresInput = this.showPresInputContent.value
                  this.ShowPresInput(ShowPresInput)
                }}>
                    <div className="modal-header">
                      <h3 className="modal-title">Patient History</h3>
                      <input
                              id="postContent"
                              type="number"
                              ref={(input) => { this.showPresInputContent = input }}
                              className="form-control"
                              placeholder="Enter Patient ID who's records you want to see"
                              required />
                     
                      <button onClick ={ this.getDynamicData }> Get Previous Pres</button>
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

                <form onSubmit={(event) => {
                  event.preventDefault()
                  const Uid = this.UidContent.value
                  this.Uid(Uid)

                }}>
                  <div className="cardInfo">
                    <Table className="text-dark" bordered >
                      <tbody>
                        <tr>
                          <td>
                            <input
                              id="postContent"
                              type="number"
                              ref={(input) => { this.UidContent = input }}
                              className="form-control"
                              placeholder="Enter Patient ID"
                              required />
                          </td>
                          <td>
                            <button type="submit" className="btn btn-info" onClick={this.getStaticData}>Get</button>
                          </td>
                        </tr>
                        <tr>    <td>Patient ID:</td><td> <td>{this.state.convertedId}</td></td>   </tr>
                        <tr>    <td>Name:</td> <td>{this.state.showPatients[1]}</td>        </tr>
                        <tr>    <td>Email:</td><td>{this.state.showPatients[2]}</td>        </tr>
                        <tr>    <td>Blood Group:</td><td>{this.state.showPatients[3]}</td>  </tr>
                        <tr>    <td>Gender:</td> <td>{this.state.showPatients[4]}</td>      </tr>
                        <tr>    <td>ETH Addres:</td> <td>{this.state.showPatients[5]}</td>      </tr>
                      </tbody>
                    </Table>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Doctor;