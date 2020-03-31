const Patients = artifacts.require("Patients");

module.exports = function(deployer) {
  deployer.deploy(Patients);
};

