pragma solidity ^0.5.0;
contract Patients {
    uint public Pcount=0;
    string errorString = "LE";
    address nullAddress;
    mapping(uint => Patient) public getPatient;
   struct Patient {
        uint id;
        string email;
        string Name;
        string bloodgroup;
        string gender;
        address patientAddress;
   }
   function setPatientData(string memory email,string memory Name,string memory bloodgroup,string memory gender,address patientAddress) public{
    Pcount++;
     getPatient[Pcount] = Patient(Pcount,email,Name,bloodgroup,gender,msg.sender);
   }
  function getPatientId(uint _pid) public view returns (uint){
      return getPatient[_pid].id;
   }

   //Login
  function FetchPatientDataById(uint _pid)public view returns(uint,string memory,string memory,string memory,string memory,address)
  {
      if(msg.sender == getPatient[_pid].patientAddress)
      {
        return(getPatient[_pid].id,getPatient[_pid].Name,getPatient[_pid].email,getPatient[_pid].bloodgroup,getPatient[_pid].gender,getPatient[_pid].patientAddress);
      }
      else
      {
          return (0,errorString,errorString,errorString,errorString,nullAddress);
      }
    }
    
}

