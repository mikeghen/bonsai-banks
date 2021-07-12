var bonsaiBank = artifacts.require("./BonsaiBank.sol");

module.exports = function (deployer) {
	deployer.deploy(bonsaiBank, "0x12c1c0AD47c677cD771bFB4b92B7C0a59E78B5dC");
};
