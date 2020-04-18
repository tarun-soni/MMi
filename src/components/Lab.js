import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Meme from '../abis/Meme.json';
import Presc from '../abis/Presc.json';

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
     const MedData = await this.state.DoctorContract.methods.getData(1).call();
     this.setState({MedData : MedData})
     console.log('ID', this.state.MedData[0].toNumber())
     
 
    // console.log('MedData', this.state.MedData[1])
   
     console.log('reqreport', this.state.MedData[2])
 
     console.log('isresolved', this.state.MedData[3])

   //  for(var i = 1;i<4;i++){
       for(var j = 0;j<MedData[1].length;j++){
        console.log('MedData', MedData[1][j])
        console.log('loop value',j)
   }
  //  }

  for(var j = 0;j<MedData[3].length;j++){
    if(MedData[3][j] == "pending"){
      console.log("reports required",this.state.MedData[2][j]);
    }
   }
  }


   getDynamicData = () => {
    console.log("in get Dynamic")
    this.loadBlockchainData()
    this.GetPatientDynamicData()  
   /* const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
    const Item = Struct('requestReport', 'isReolved')
    var myItems = [
        Item(this.state.MedData[2][1], this.state.MedData[3])
    ];
    
    console.log(myItems);
    console.log(myItems[0].requestReport);
    console.log(myItems[0].isReolved);
*/
  };
  constructor(props) {
    super(props)

    this.state = {
      memeHash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      MedData:'',

      randomt: null,
      randomf: ''
    }
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
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if (error) {
        console.error(error)
        return
      }
      this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
        return this.setState({ memeHash: result[0].hash })

      })
      this.state.contract.methods.setRandom(this.state.randomt).send({ from: this.state.account }).then((r) => {
        return this.setState({ randomf: this.state.randomt })

      })
      
    })

  }

  render() {
    return (
      <div>
         <h1> Lab Report </h1>
        <div className="formBorder1 container-fluid mt-5">

          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
               
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} />
              
                <p>&nbsp;</p>
                <h2>Upload file</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input className="btns" type='submit' />
                </form>
    <button onClick={this.getDynamicData} >Get Reports</button>
              </div>
            </main>
          </div>
        </div>
      </div >
    );
  }
}


export default Lab;