# Bonsai Banks
Tradeable Savings Accounts featuring evolving digital artwork and game-mechanisms to incentivize saving.

## Overview
* Bonsai Banks are bonsai NFT artworks that need tended to using on-chain transactions
* Each Bonsai Bank...
  * is minted by the _botonist_ or contract owner
  * must be _watered_ by depositing 20 DAI into the bank every 7 days
  * must be _fertilized_ by depositing 0.02 ETH into the bank every 30 days
  * can _wither_ if watering is more than 7 days late and 5% of the deposits will go to the botonist
  * can _grow_ if taken care of correctly for 90 days and the botonist will make enhance the bonsai art
  * must be _destroyed_ to recover the deposits plus an interest earned

## Protocol Specification


### Parameters
* `address botonist` - The owner of the contract and the producer of the artworks
* `BonsaiBank[] bonsaiBanks` - A list of all the bonsai banks indexable using `bonsaiId`s
* `address waterToken` - The token used to water the plant
* `address fertToken` - The token used to fertilize a plant
* `uint256 waterAmount` - The amount of `waterToken` needed to water the plant
* `uint256 fertAmount` - The amount of `fertToken` needed to fertilize the plant
* `uint256 waterRate` - The duration in seconds to wait between waterings
* `uint256 fertRate` - The duration in seconds to wait between fertilizings

### Structures
* BonsaiBank
  * `uint256 lastWatered` - The unix timestamp when the plant was last watered
  * `uint256 consecutiveWaterings` - The number of consecutive waterings
  * `uint256 lastFertilized` - The unix timestamp when the plant was last fertilized
  * `uint256 consecutiveFertilizings` - The number of consecutive fertilizings
  * `uint265 bonsaiId` - The id of this BonsaiBank, used as the token ID for NFTs
  * `string[] bonsaiUris` - A list of all the images in cronological order for this BonsaiBank
  * `int lifeStage` - An index into `bonsaiUris` and references the plants current image URI
  * `mapping(address => uint265) balances` - A mapping of token addresses to amounts deposited to the Bonsai bank

### Modifiers
* `onlyBotonist` - modifies methods so they can only be called by `botonist`

### Methods
#### water(uint256 bonsaiId)
* Parameters
  * `bonsaiId` - The id of the bonsai to water
* Pre-conditions
  * Must approve `waterAmount` amount of `waterToken`
* Post-conditions
  * Transfer `waterAmount` amount of `waterToken` to the BonsaiBank
  * Resets `lastWatered` timestamp
  * Increments `consecutiveFertilizings`
  * `balances` is increased to reflect the deposit

#### fertilize(uint256 bonsaiId)
* Parameters
  * `bonsaiId` - The id of the bonsai to fertilize
* Pre-conditions
  * Must approve `fertAmount` amount of `fertToken`
* Post-conditions
  * Transfer `fertAmount` amount of `fertToken` to the BonsaiBank
  * Resets `lastFertilized` timestamp
  * Increments `consecutiveFertilizings`
  * `balances` is increased to reflect the deposit

#### grow(uint256 bonsaiId, string bonsaiUri) onlyBotonist
* Parameters
  * `bonsaiId` - The id of the bonsai to water
  * `bonsaiUri` - The id of the new image for the plant
* Pre-conditions
  * The bonsai has 12 consecutive waterings and 3 consecutive fertilizing
* Post-conditions
  * The new `bonsaiURI` is added to the `bonsaiUris`
  * The `lifeStage` is incremented by 1
  * `consecutiveWaterings` and `consecutiveFertilizings` are reset

#### wither(uint256 bonsaiId) onlyBotonist
* Parameters
  * `bonsaiId` - The id of the bonsai to wither
  * `bonsaiUri` - The id of the new image for the plant
* Pre-conditions
  * It has been `waterRate * 2` seconds since the last watering
* Post-conditions
  * 5% of all `balances` for this bonsai are slashed and set to the botonist


#### destroy(uint256 bonsaiId)
* Parameters
  * `bonsaiId` - The id of the bonsai to destroy
* Pre-conditions
  * The message sender is the holder of the bonsai
* Post-conditions
  * The NFT is burned and all `balances` are sent to the message sender
