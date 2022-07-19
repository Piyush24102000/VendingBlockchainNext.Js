const Vending = artifacts.require("vending");

module.exports = function (deployer) {
  deployer.deploy(Vending);
};
