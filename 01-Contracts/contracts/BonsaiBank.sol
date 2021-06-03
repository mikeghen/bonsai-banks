// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC721/ERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/utils/Counters.sol";

contract BonsaiBank is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private bonsaiIds;

    struct Bonsai {
      uint256 lastWatered;
      uint256 consecutiveWaterings;
      uint256 waterBalance;
      uint256 lastFertilized;
      uint256 consecutiveFertilizings;
      uint256 fertilizerBalance;
      uint256 lifeStage;
      uint256 bonsaiId;
    }

    Bonsai[] bonsaiBanks; // All bonsai banks, indexible by tokenId - 1

    address botanist;
    address waterToken;
    address fertToken;
    uint256 waterAmount;
    uint256 fertAmount;
    uint256 waterRate;
    uint256 fertRate;


    constructor() ERC721("Bonsai Bank", "BNZI") {}

    // @dev Mints a new Bonsai Bank directly to the caretaker
    function mint(address caretaker, string memory bonsaiURI) external returns (uint256 bonsaiId) {

      bonsaiIds.increment();
      uint256 _bonsaiId = bonsaiIds.current();
      Bonsai memory bb = Bonsai(0,0,0,0,0,0,0,_bonsaiId);
      _mint(caretaker, _bonsaiId);
      _setTokenURI(_bonsaiId, bonsaiURI);
      bonsaiBanks.push(bb);
      return _bonsaiId;

    }

    function water(uint256 bonsaiId) external {
      // ...
    }

    function fertilize(uint256 bonsaiId) external {
      // ...
    }

    function grow(uint256 bonsaiId, string memory bonsaiURI) external {
      // ...
    }

    function wither(uint256 bonsaiId, string memory bonsaiURI) external {
      // ...
    }

    function destroy(uint256 bonsaiId) external {
      // ...
    }

    // Getter Methods

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



}
