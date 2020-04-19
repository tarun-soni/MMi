import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Meme from '../abis/Meme.json';
import Presc from '../abis/Presc.json';
import {Card} from 'react-bootstrap';
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
class Lab extends Component {
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
    const networkData = Meme.networks[networkId]
    //pres
    const DoctorNetworkData = Presc.networks[networkId]
    if (networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
      console.log(this.state.memeHash)
      const randomt = await contract.methods.getRandomText().call()
      this.setState({ randomt })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
    if(DoctorNetworkData){
      const DoctorContract = web3.eth.Contract(Presc.abi, DoctorNetworkData.address)
      this.setState({ DoctorContract })
    }else{
      window.alert('Smart contract not deployed to detected network.')
    }
    console.log(accounts)
  }
  async GetPatientDynamicData(){
    await this.loadBlockchainData()
    //getting prev records of patients
     const MedData = await this.state.DoctorContract.methods.getData(this.state._id).call();
     console.log('ID', MedData[0].toNumber())
this.setState({rData: MedData[2]})
console.log('reqreport', this.state.rData)
this.setState({sData: MedData[3]})
console.log('isresolved', this.state.sData)
this.setState({lengthOfReport:MedData[2].length})
   //  for(var i = 1;i<4;i++){
       for(var j = 0;j<MedData[1].length;j++){
        console.log('MedData', MedData[1][j])
   }
  //  }
  for(let j = 0;j<=MedData[3].length;j++){
    if(MedData[3][j] == "pending"){
      console.log("reports required",MedData[2][j]);
      this.setState({
        indexArrayofReport: [...this.state.indexArrayofReport, j]
      })
    }
   }
console.log('indexes',this.state.indexArrayofReport)
  }
   getDynamicData = () => {
    console.log("in get Dynamic")
    this.loadBlockchainData()
    this.GetPatientDynamicData()
  };
  constructor(props) {
    super(props)
    this.state = {
      memeHash: '',
      memeHashArray:[],
      contract: null,
      DoctorContract:'',
      web3: null,
      buffer: null,
      account: null,
      _id: '' ,
     rData:[],
     sData:[] ,
     lengthOfReport:'',
     indexArrayofReport:[]
    }
    this.ShowReportInput = this.ShowReportInput.bind(this)
  }
  showCards = () =>{
    let Cards = []
    for(let i = 0; i<this.state.indexArrayofReport.length ;i++){
      Cards.push(
        <Card className="Dcard card" key={this.state._id}>
          
          <h5>Reports:{this.state.rData[this.state.indexArrayofReport[i]]}</h5>
           <h5>Status:{this.state.sData[this.state.indexArrayofReport[i]]}</h5>
              <input type='file' onChange={this.captureFile} />
              <input className="btns" type='submit' />
        </Card>
        // <Lcard
        // className="Dcard"
        // Index = {i}
        // pReport={this.state.rData[i]}
        // status={this.state.sData[i]}
        // captureFile={this.state.captureFile}
        // />
      )
    }
    return Cards
  }
  ShowReportInput(ShowReportInput) {
    this.setState({_id: ShowReportInput})
  }
    captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }
  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    if(this.state.buffer == null){
      window.alert('no file chosen')
    }else{
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result[0])
      if (error) {
        console.error(error)
        return
      }
       this.setState({ memeHash: result[0].hash })
    this.state.memeHashArray.push(result[0].hash)
    window.alert('sucessfully submitted')
  /*    this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
        return this.setState({ memeHash: result[0].hash })
      })*/
    })
  }
  }
  render() {
    return (
      <div>
         <div className="DisplayCard container-fluid mt-5">
         <form onSubmit={(event) => {
                  event.preventDefault()
                  const ShowReportInput = this.showReportInputContent.value
                  this.ShowReportInput(ShowReportInput)
                }}>
            <div className="input-group mb-3">
            <input
            id="postContent"
            type="number"
            ref={(input) => { this.showReportInputContent = input }}
            className="form-control"
            placeholder="Enter Patient ID"
            required
            />
            <div className="input-group-append">
           <button className="btn btn-success" onClick={this.getDynamicData}>Get Reports</button>
           </div>
           </div>
           <button className="btn btn-info hashSubmit" onClick={(event) => {
           console.log('memeHashArrayI', this.state.memeHashArray)
           console.log('before updating',this.state.rData)
           console.log('before updating',this.state.sData)
            for(let i = 0 ;i<this.state.memeHashArray.length;i++)
            {
              this.state.rData[this.state.indexArrayofReport[i]] =  this.state.memeHashArray[i]
              this.state.sData[this.state.indexArrayofReport[i]] = "true";
            }
              this.state.DoctorContract.methods.updateArray(this.state._id,this.state.rData, this.state.sData)
              .send({ from: this.state.account }).then((r) => {
                return this.setState({
                  rData: this.state.rData,
                  sData:this.state.sData
                })
              })
            console.log('after updating',this.state.rData)
              console.log('after updating',this.state.sData)
         }}> Upload All reports</button>
           </form>
         </div>
         <div className="modal-lg hashSubmit">
         <form onSubmit={this.onSubmit} >
                {this.showCards()}
            </form>
         </div>
        <div className="centor container-fluid mt-5">
       {/* <iframe src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} height="500" width="500"></iframe> */}
        </div>
      </div >
    );
  }
}
export default Lab;