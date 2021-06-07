// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC721/ERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/utils/Counters.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/utils/math/SafeMath.sol";

contract BonsaiBank is ERC721URIStorage {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private bonsaiIds;

    struct Bonsai {
      uint256 lastWatered;               // The last time the bonsai was watered
      uint256 consecutiveWaterings;      // The number of waterings gone without missing a watering
      uint256 waterBalance;              // The amount of water tokens deposited
      uint256 lastFertilized;            // The last time the bonsai was fertilized
      uint256 consecutiveFertilizings;   // The number of fertilizings without missing a fertilize
      uint256 fertilizerBalance;         // The amount of fertilizer tokens deposited
      uint256 lifeStage;                 // The amount of times this bonsai has been grown or wilted
    }

    Bonsai[] bonsaiBanks;                // All bonsai banks, indexible by bonsai/tokenId - 1

    address botanist;                   // The owner of the contract, has control of the protocol
    address waterToken;                 // The ERC20 token address to use for watering
    address fertToken;                  // The ERC20 token address to use for fertilizing
    uint256 waterAmount;                // The amount of waterTokens needed for watering
    uint256 fertAmount;                 // The amount of fertTokens needed for fertilizing
    uint256 waterRate;                  // The time delay between waterings in seconds
    uint256 fertRate;                   // The time delay between fertilizing in seconds
    uint256 wateringsToGrow;            // The number of consecutive waterings needed to grow


    constructor(address _botanist) ERC721("Bonsai Bank", "BNZI") {
        botanist = _botanist;
    }

    modifier onlyBotanist {
      require(msg.sender == botanist);
      _;
    }

    // Getter Methods

    function getBotanist() public view returns(address) {
      return botanist;
    }

    function getWaterToken() public view returns(address) {
      return waterToken;
    }

    function getFertToken() public view returns(address) {
      return fertToken;
    }

    function getWaterAmount() public view returns(uint256) {
      return waterAmount;
    }

    function getFertAmount() public view returns(uint256) {
      return fertAmount;
    }

    function getWaterRate() public view returns(uint256) {
      return waterRate;
    }

    function getFertRate() public view returns(uint256) {
      return fertRate;
    }

    function lastWatered(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].lastWatered;
    }

    function consecutiveWaterings(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].consecutiveWaterings;
    }

    function waterBalance(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].waterBalance;
    }

    function lastFertilized(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].lastFertilized;
    }

    function consecutiveFertilizings(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].consecutiveFertilizings;
    }

    function fertilizerBalance(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].fertilizerBalance;
    }

    function lifeStage(uint256 bonsaiId) external view returns (uint256){
      return bonsaiBanks[bonsaiId-1].lifeStage;
    }

    function exists(uint256 bonsaiId) external view returns (bool){
      return _exists(bonsaiId);
    }

    // Setter Methods
    function setBotanist(address _botanist) external onlyBotanist {
      botanist = _botanist;
    }

    function setWaterToken(address _waterToken) external onlyBotanist {
      waterToken = _waterToken;
    }

    function setFertToken(address _fertToken) external onlyBotanist {
      fertToken = _fertToken;
    }

    function setWaterAmount(uint256 _waterAmount) external onlyBotanist {
      waterAmount = _waterAmount;
    }

    function setFertAmount(uint256 _fertAmount) external onlyBotanist {
      fertAmount = _fertAmount;
    }

    function setWaterRate(uint256 _waterRate) external onlyBotanist {
      waterRate = _waterRate;
    }

    function setFertRate(uint256 _fertRate) external onlyBotanist {
      fertRate = _fertRate;
    }

    function setWateringsToGrow(uint256 _wateringsToGrow) external onlyBotanist {
      wateringsToGrow = _wateringsToGrow;
    }

    // Interal only setters for Bonsai Banks
    function setLastWatered(uint256 bonsaiId, uint256 _lastWatered) internal {
      bonsaiBanks[bonsaiId-1].lastWatered = _lastWatered;
    }

    function setConsecutiveWaterings(uint256 bonsaiId, uint256 _consecutiveWaterings) internal {
      bonsaiBanks[bonsaiId-1].consecutiveWaterings = _consecutiveWaterings;
    }

    function setWaterBalance(uint256 bonsaiId, uint256 _waterBalance) internal {
      bonsaiBanks[bonsaiId-1].waterBalance = _waterBalance;
    }

    function setLastFertilized(uint256 bonsaiId, uint256 _lastFertilized) internal {
      bonsaiBanks[bonsaiId-1].lastFertilized = _lastFertilized;
    }

    function setConsecutiveFertilizings(uint256 bonsaiId, uint256 _consecutiveFertilizings) internal {
      bonsaiBanks[bonsaiId-1].consecutiveFertilizings = _consecutiveFertilizings;
    }

    function setFertilizerBalance(uint256 bonsaiId, uint256 _fertilizerBalance) internal {
      bonsaiBanks[bonsaiId-1].fertilizerBalance = _fertilizerBalance;
    }

    function setLifeStage(uint256 bonsaiId, uint256 _lifeStage) external {
      bonsaiBanks[bonsaiId-1].lifeStage = _lifeStage;
    }

    // Core Bonsai Bank Functionality

    // @dev Mints a new Bonsai Bank directly to the caretaker
    function mint(address caretaker, string memory bonsaiURI) external onlyBotanist returns (uint256 bonsaiId)  {
      bonsaiIds.increment();
      uint256 _bonsaiId = bonsaiIds.current();
      Bonsai memory bb = Bonsai(0,0,0,0,0,0,0);
      _mint(caretaker, _bonsaiId);
      _setTokenURI(_bonsaiId, bonsaiURI);
      bonsaiBanks.push(bb);
      return _bonsaiId;
    }

    function water(uint256 _bonsaiId) external {
      require(bonsaiBanks[_bonsaiId - 1].lastWatered < block.timestamp - waterRate, "!waterable");
      require(IERC20(waterToken).transferFrom(msg.sender, address(this), getWaterAmount()), "!watered");
      bonsaiBanks[_bonsaiId - 1].lastWatered = block.timestamp;
      bonsaiBanks[_bonsaiId - 1].consecutiveWaterings += 1;
      bonsaiBanks[_bonsaiId - 1].waterBalance += getWaterAmount();
    }

    function fertilize(uint256 _bonsaiId) external {
      require(bonsaiBanks[_bonsaiId - 1].lastFertilized < block.timestamp - fertRate, "!fertalizable");
      require(IERC20(fertToken).transferFrom(msg.sender, address(this), getFertAmount()), "!fertilized");
      bonsaiBanks[_bonsaiId - 1].lastFertilized = block.timestamp;
      bonsaiBanks[_bonsaiId - 1].consecutiveFertilizings += 1;
      bonsaiBanks[_bonsaiId - 1].fertilizerBalance += getFertAmount();
    }

    function grow(uint256 _bonsaiId, string memory _bonsaiURI) external onlyBotanist {
      require(bonsaiBanks[_bonsaiId - 1].consecutiveWaterings >= wateringsToGrow, "!growable");
      _setTokenURI(_bonsaiId, _bonsaiURI);
      bonsaiBanks[_bonsaiId - 1].lifeStage += 1;
      bonsaiBanks[_bonsaiId - 1].consecutiveWaterings = 0;
    }

    function wilt(uint256 _bonsaiId, string memory _bonsaiURI) external onlyBotanist {
      require(bonsaiBanks[_bonsaiId - 1].lastWatered <= block.timestamp - waterRate.mul(2), "!wiltable");
      uint256 waterSlashAmount = bonsaiBanks[_bonsaiId - 1].waterBalance.mul(95).div(100);     // TODO: Safe Math
      uint256 fertSlashAmount = bonsaiBanks[_bonsaiId - 1].fertilizerBalance.mul(95).div(100); // TODO: Safe Math
      require(IERC20(waterToken).transfer(botanist,  waterSlashAmount), "!slashedWater");
      require(IERC20(fertToken).transfer(botanist, fertSlashAmount), "!slashedFert");
      _setTokenURI(_bonsaiId, _bonsaiURI);
      bonsaiBanks[_bonsaiId - 1].consecutiveWaterings = 0;
      bonsaiBanks[_bonsaiId - 1].consecutiveFertilizings = 0;
    }

    function destroy(uint256 _bonsaiId) external {
      require(ownerOf(_bonsaiId) == msg.sender, "!caretaker");
      require(IERC20(waterToken).transfer(msg.sender,  bonsaiBanks[_bonsaiId - 1].waterBalance), "!withdrawWater");
      require(IERC20(fertToken).transfer(msg.sender, bonsaiBanks[_bonsaiId - 1].fertilizerBalance), "!withdrawFertlizer");
      bonsaiBanks[_bonsaiId - 1].waterBalance = 0;
      bonsaiBanks[_bonsaiId - 1].fertilizerBalance = 0;
      _burn(_bonsaiId);
    }

}
