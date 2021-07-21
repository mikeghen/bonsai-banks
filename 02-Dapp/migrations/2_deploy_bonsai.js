var bonsaiBank = artifacts.require("./BonsaiBank.sol");

module.exports = function (deployer) {
	deployer.deploy(bonsaiBank, "0x1CE94DB33562088d9Af36a59b6FBB42dC28C4229");
};
