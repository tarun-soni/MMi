import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import Form from './Modal';
import { Card, Table } from 'react-bootstrap';
import Patients from '../abis/Patients.json';
import Dcard from './Dcard'
import Presc from '../abis/Presc.json'
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
  async loadBlockchainGetData() {

    await this.loadBlockchainData()
    const displayingUid = await this.state.contract.methods.getPatientId(this.state._id).call()

    const convertedId = displayingUid.toNumber()
    this.setState({ convertedId })


    const showPatients = await this.state.contract.methods.getPatient(this.state._id).call()
    this.setState({ showPatients })
    /*
       this.setState({
          showPatients: [...this.state.showPatients, showPatients]
        })
      */
    const savePass = await this.state.contract.methods.getPatientPass(this.state._id).call()


    if (savePass !== null && this.state._storedPass === savePass) {

      this.setState({ displayingEmail: showPatients[1] })
      this.setState({ displayingName: showPatients[2] })
      this.setState({ displayingBlood: showPatients[3] })
      this.setState({ displayingGender: showPatients[4] })
      this.setState({ displayingAddress: showPatients[5] })
    }
    else {
      window.alert('login failed');

      this.setState({ displayingEmail: null })
      this.setState({ displayingName: null })
      this.setState({ displayingBlood: null })
      this.setState({ displayingGender: null })
      this.setState({ displayingAddress: null })
      this.setState({ _id: 1000000000 })

    }


    //get reports 
    const MedData = await this.state.DoctorContract.methods.getData(this.state._id).call();

    this.setState({ mData: MedData[1] })
    this.setState({ lengthOfMed: MedData[1].length })

    this.setState({ rData: MedData[2] })
    this.setState({ sData: MedData[3] })


  }
  showCards = () => {
    let Cards = []
    for (let i = 0; i < this.state.lengthOfMed; i++) {
      Cards.push(
        <Dcard key={i}
          className="Dcard"
          mName={this.state.mData[i]}
          pReport={this.state.rData[i]}
          status={this.state.sData[i]}
        />
      )
    }
    return Cards
  }
  //Modal Related Funtions
  getData = () => {
    this.loadBlockchainGetData()
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

  //STORING VALUES FROM FORM INTO _VARS
  EmailId(Email) {
    this.setState({ _mail: Email })
  }
  Pass(Pass) {
    this.setState({ _pass: Pass })
  }
  Name(Name) {
    this.setState({ _name: Name })
  }
  Blood(BloodGrp) {
    this.setState({ _bgrp: BloodGrp })
  }
  Gender(Gender) {
    this.setState({ _gender: Gender })
  }
  Uid(Uid) {
    this.setState({ _id: Uid })
  }

  inputPass(inputPass) {
    this.setState({ _storedPass: inputPass })
  }
  constructor(props) {
    super(props)
    this.state = {

      // VALUES NEEDED FOR CONTRACT   
      contract: null,
      DoctorContract: null,  // stores value of contracts
      web3: null,
      account: null, // stores value of logged in account

      // STORES FINAL STRING VALUE OF INPUT FIELDS
      _mail: '',
      _name: '',
      _bgrp: '',
      _gender: '',
      //input during get data
      _id: '',
      _pass: '',
      _storedPass: '',

      //  STORES VALUE BY GETIING DATA FROM BC & DISPLAYING
      showPatients: [],
      displayingName: '',
      displayingEmail: '',
      displayingBlood: '',
      displayingGender: '',
      displayingUid: '',
      convertedId: '',
      displayingAddress: '',

      lengthOfMed: '',
      mData: [],
      rData: [],
      sData: [],

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
    this.Pass = this.Pass.bind(this);
    this.inputPass = this.inputPass.bind(this);
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
                const inputPass = this.inputPassContent.value
                this.inputPass(inputPass)
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
                <input
                  id="postContent"
                  type="password"
                  ref={(input) => { this.inputPassContent = input }}
                  className="form-control"
                  placeholder="Enter your Pass"
                  required />
                <hr />
                <button type="submit" className="btn btn-outline-info" onClick={this.getData}>Get Data</button>
              </form>
              <hr />
              <Card className="card">
                {/* <h4>Address binded: {this.state.displayingAddress}</h4> */}
                <Table className="text-dark" bordered >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Blood Group</th>
                      <th>Gender</th>
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
                {this.showCards()}
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
              const Pass = this.PassContent.value
              this.Pass(Pass)
            }
            }
            >


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
                <input
                  id="postContent"
                  type="password"
                  ref={(input) => { this.PassContent = input }}
                  className="ip form-control"
                  placeholder="Enter a strong password"
                  required />

              </div>
              <button type="submit" className="ops btn btn-block">Save Info</button>
              <hr />
              <button className="ops btn btn-block" onClick={(event) => {
                this.state.contract.methods.setPatientData(
                  this.state._mail,
                  this.state._name,
                  this.state._bgrp,
                  this.state._gender,
                  this.state.account,
                  this.state._pass)
                  .send({ from: this.state.account }).then((r) => {
                    return this.setState({
                      _mail: this.state._mail,
                      _name: this.state._name,
                      _bgrp: this.state._bgrp,
                      _gender: this.state._gender,
                      account: this.state.account,
                      _pass: this.state._pass
                    })
                  })
              }
              }>
                Register
                  </button>
            </form>
          </Form>
        </div>
      </div>
    );
  }
}
export default Patient;