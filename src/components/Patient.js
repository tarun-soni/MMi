import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import Form from './Modal';
import { Card, Table } from 'react-bootstrap';
import Patients from '../abis/Patients.json';
import { ControlLabel } from 'react-bootstrap';
class Patient extends React.Component {
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
    if (networkData) {
      const contract = web3.eth.Contract(Patients.abi, networkData.address)
      this.setState({ contract })

      const displayingUid = await contract.methods.getPatientId(this.state._id).call()
      const convertedId = displayingUid.toNumber()
      this.setState({ convertedId })
      console.log('Id binded to patient is', convertedId)
  
      
      const showPatients = await contract.methods.FetchPatientDataById(this.state._id).call()
      this.setState({ showPatients })
    /*
       this.setState({
          showPatients: [...this.state.showPatients, showPatients]
        })
      */


     this.setState({ displayingEmail: showPatients[1] })
     this.setState({ displayingName: showPatients[2] })
     this.setState({ displayingBlood: showPatients[3] })
     this.setState({ displayingGender: showPatients[4] })
     this.setState({ displayingAddress: showPatients[5] })
     
      
      console.log('disp email:::::   ', this.state.displayingEmail)
      console.log('show name::::: ', this.state.displayingName)
      console.log('show bg:::::  ', this.state.displayingBlood)
      console.log('show gender::::', this.state.displayingGender)
      console.log('show address::::: ', this.state.displayingAddress)
     
    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
    console.log('current logged in account ', this.state.account)
  }
  //Modal Related Funtions
  getData = () => {
    this.loadBlockchainData()
    console.log('in getData')
  };
  ToggleSubmit = () => {
    this.setState({
      isopen: !this.state.isopen
    });
  };
  ToggleShow = () => {
    this.setState({
      isenter: !this.state.isenter
    });
  };
  refresh = () => {
    window.location.reload(false)
  }
  //Modal Related Fucntion Ends
  submit = (event) => {
    event.preventDefault()
    //set data
    console.log("in on sub")
    /* this.state.contract.methods.addP(this.state.EmailId, this.state.Name, this.state.Blood, this.state.Gender, this.state.PhNo, this.state.Add).send({ from: this.state.account }).then((r) => {
      return this.setState({ EmailId: this.state.EmailId, Name: this.state.Name, Blood: this.state.Blood, Gender: this.state.Gender, PhNo: this.state.PhNo, Add: this.state.Add })
    })*/
  }
//STORING VALUES FROM FORM INTO _VARS
  EmailId(Email) {
    this.setState({ _mail: Email })
    console.log('Email ID', this.state._mail)
  }
  Name(Name) {
    this.setState({ _name: Name })
    console.log('Name', Name)
  }
  Blood(BloodGrp) {
    this.setState({ _bgrp: BloodGrp })
    console.log('Blood Group', BloodGrp)
  }
  Gender(Gender) {
    this.setState({ _gender: Gender })
    console.log('Gender', Gender)
  }
  Uid(Uid) {
    this.setState({ _id: Uid })
    console.log('Uid state', this.state._id)
  }
  
  constructor(props) {
    super(props)
    this.state = {

      // VALUES NEEDED FOR CONTRACT   
      contract: null,
      contractMeme: null,
      web3: null,
      account: null,
      showPatients: [],
      // STORES VALUE OF INPUT
      _mail: '',
      _name: '',
      _bgrp: '',
      _gender: '',
      _id: '',
      pre: 'value in js',

      //  STORES VALUE FOR DISPLAYING
      displayingName: '',
      displayingEmail: '',
      displayingBlood: '',
      displayingGender: '',
      displayingUid: '',
      convertedId: '',
      displayingAddress: '',
      //  TOGGLE  
      isopen: false,
      isenter: false
    }
    //BINDING FORM VALUES
    this.EmailId = this.EmailId.bind(this);
    this.Name = this.Name.bind(this);
    this.Blood = this.Blood.bind(this);
    this.Gender = this.Gender.bind(this);
    this.Uid = this.Uid.bind(this);
  }
  render() {
    return (
      <div>
        <div className="container">
          {/*Start of Show Patient Data */}
          <div className="row">
            <div className="col-6">   <button data-toggle="modal" data-target="#myModal" className="btnops2 btn" onClick={this.ToggleShow}>Show Patient Info</button></div>
            <div className="col-6">  <button data-toggle="modal" data-target="#myModal" className="btnops1 btn" onClick={this.ToggleSubmit}>Patient registration</button></div>
          </div>
          <Form isenter={this.state.isenter}>
            <div className="formBorder2 center-block modal-lg">
              <form onSubmit={(event) => {
                event.preventDefault()
                const Uid = this.UidContent.value
                this.Uid(Uid)
              }}>
                <div className="modal-header">
                  <h3 className="modal-title">Patient Information</h3>
                  <button type="button" className="close text-danger" onClick={this.ToggleShow}>&times;</button>
                </div>
                <input
                  id="postContent"
                  type="number"
                  ref={(input) => { this.UidContent = input }}
                  className="form-control"
                  placeholder="Enter Unique ID"
                  required />
                <hr />
                <button type="submit" className="btn btn-outline-info" onClick={this.getData}>Get Data</button>
              </form>
              <hr />
              <Card className="card">
                {/* <h4>Address binded: {this.state.displayingAddress}</h4> */}
                <Table className="text-light" striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Blood Group</th>
                      <th>Gender</th>
                      <th>Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.convertedId}</td>
                      <td> {this.state.displayingName}</td>
                      <td>{this.state.displayingEmail}</td>
                      <td>{this.state.displayingBlood}</td>
                      <td>{this.state.displayingGender}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </div>
          </ Form>
          <Form isopen={this.state.isopen}>
            <form className="formBorder2 center-block modal-body" onSubmit={(event) => {
              event.preventDefault()
              const Email = this.EmailContent.value
              this.EmailId(Email)
              const Name = this.NameContent.value
              this.Name(Name)
              const BloodGrp = this.BloodContent.value
              this.Blood(BloodGrp)
              const Gender = this.GenderContent.value
              this.Gender(Gender)
            }
            }>
              <div className="modal-header">
                <h3 className="modal-title">Patient Registration</h3>
                <button type="button" className="close text-danger" onClick={this.ToggleSubmit}>&times;</button>
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="postContent"
                  type="text"
                  ref={(input) => { this.EmailContent = input }}
                  className="ip form-control"
                  placeholder="Email ID"
                  required />
                <input
                  id="postContent"
                  type="text"
                  ref={(input) => { this.NameContent = input }}
                  className="ip form-control"
                  placeholder="Name"
                  required />
                <input
                  id="postContent"
                  type="text"
                  ref={(input) => { this.BloodContent = input }}
                  className="ip form-control"
                  placeholder="Blood Group"
                  required />
                <input
                  id="postContent"
                  type="text"
                  ref={(input) => { this.GenderContent = input }}
                  className="ip form-control"
                  placeholder="Gender"
                  required />
              </div>
              <button type="submit" className="ops btn btn-block">Save Info</button>
              <hr />
              <button className="ops btn btn-block" onClick={(event) => {
                console.log("Submit button pressed")
                this.state.contract.methods.setPatientData(
                  this.state._mail,
                  this.state._name,
                  this.state._bgrp,
                  this.state._gender,
                  this.state.account)
                  .send({ from: this.state.account }).then((r) => {
                    return this.setState({
                      _mail: this.state._mail,
                      _name: this.state._name,
                      _bgrp: this.state._bgrp,
                      _gender: this.state._gender,
                      account: this.state.account
                    })
                  })
              }
              }>
                submit button
                  </button>
            </form>
          </Form>
        </div>
      </div>
    );
  }
}
export default Patient;