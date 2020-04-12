pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
contract Presc {
    uint public Pcount=0;
struct pres {
  uint id;
  string[] meds;

}
mapping(uint => pres) public userStructs;

function addMed(uint _id, string memory med) public  {
 userStructs[_id].id = _id;
  userStructs[_id].meds.push(med);

}
 function getData(uint _pid) public view returns (uint, string[] memory){
     
      return (userStructs[_pid].id,userStructs[_pid].meds);
    //  return (userStructs[_pid].id,userStructs[_pid].meds[1]);
      
   }
}
