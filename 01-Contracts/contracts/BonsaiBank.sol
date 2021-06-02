// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC721/ERC721.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/utils/Counters.sol";

contract BonsaiBank is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _bonsaiIds;

    constructor() ERC721("Bonsai Bank", "BNZI") {}

    // Methods

    function mint(address caretaker, string memory bonsaiURI) external returns (uint256 bonsaiId) {
      // ...
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

    function waterBalance(uint256 bonsaiId) external view returns (uint256){
      // ...
    }

    function fertilizerBalance(uint256 bonsaiId) external view returns (uint256){
      // ...
    }

    function lastWatered(uint256 bonsaiId) external view returns (uint256){
      // ...
    }

    function consecutiveWaterings(uint256 bonsaiId) external view returns (uint256){
      // ...
    }

    function lastFertilized(uint256 bonsaiId) external view returns (uint256){
      // ...
    }

    function consecutiveFertilizings(uint256 bonsaiId) external view returns (uint256){
      // ...
    }

    function lifeStage(uint256 bonsaiId) external view returns (uint256){
      // ...
    }



}
