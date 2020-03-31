pragma solidity >=0.4.21 <0.6.0;
contract Meme {
  string memeHash;
  string random_text = "Patient Reports to be uploaded";
	string random_text1;
  function set(string memory _memeHash) public {
    memeHash = _memeHash;
  }
  function get() public view returns (string memory) {
    return memeHash;
  }
  function getRandomText() public view returns (string memory) {
    return random_text;
  }

  function setRandom(string memory _random_text1) public {
    random_text1 = _random_text1;
  }
function getRandomText1() public view returns (string memory) {
    return random_text1;
  }
}
