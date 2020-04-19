pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
contract Presc {
    // uint ReportLength = RequestReport.length;
   // uint public ReqRep=0;
    uint public index ;
    string public lastTestStringResult; 
struct pres {
  uint id;
uint []ReqRep;
  string[] meds;
  string[] RequestReport;
  string[] isResolved;
}
mapping(uint => pres) public userStructs;


function addMed(uint _id, string memory med, string memory _reqRep) public  {
userStructs[_id].id = _id;
  userStructs[_id].meds.push(med);
  userStructs[_id].RequestReport.push(_reqRep);
 // if(userStructs[_id].ReqRep.length == 0){
    index = (userStructs[_id].ReqRep.length);
  /*}else
  {
      index = ( userStructs[_id].ReqRep.length);
  }*/
userStructs[_id].ReqRep.push(index);
    bool compBool =  compareStrings((userStructs[_id].RequestReport[index]),"");
        if(!compBool){
                userStructs[_id].isResolved.push("pending");
        }
        else{
                userStructs[_id].isResolved.push("null");
        }
    }
  function compareStrings (string memory a, string memory b) public  returns (bool) {
            return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
       }
       
         
function getData(uint _pid) public view returns (uint, string[] memory,string[] memory,string[] memory){
      return (userStructs[_pid].id,userStructs[_pid].meds,userStructs[_pid].RequestReport,userStructs[_pid].isResolved);
   }
   
   
    
    function updateArray(uint _id, string[] memory _reqRep,string[] memory _isResolved) public {
      //  userStructs[_id].meds.push(med);
        userStructs[_id].RequestReport = _reqRep;
     userStructs[_id].isResolved = _isResolved;
    }
}