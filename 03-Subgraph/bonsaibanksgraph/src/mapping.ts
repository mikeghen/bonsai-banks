import { BigInt } from "@graphprotocol/graph-ts"
import {
  BonsaiBank,
  Approval,
  ApprovalForAll,
  BonsaiCreated,
  BonsaiDestroy,
  BonsaiFertilized,
  BonsaiGrow,
  BonsaiWatered,
  BonsaiWilt,
  Transfer
} from "../generated/BonsaiBank/BonsaiBank"
import { Bonsai,Growth,Water,Fertilize,Wilt,Destroy } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // // Entity fields can be set based on event parameters
  // entity.owner = event.params.owner
  // entity.approved = event.params.approved

  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
  // - contract.getBotanist(...)
  // - contract.getWaterToken(...)
  // - contract.getFertToken(...)
  // - contract.getWaterAmount(...)
  // - contract.getFertAmount(...)
  // - contract.getWaterRate(...)
  // - contract.getFertRate(...)
  // - contract.lastWatered(...)
  // - contract.consecutiveWaterings(...)
  // - contract.waterBalance(...)
  // - contract.lastFertilized(...)
  // - contract.consecutiveFertilizings(...)
  // - contract.fertilizerBalance(...)
  // - contract.lifeStage(...)
  // - contract.exists(...)
  // - contract.mint(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleBonsaiCreated(event: BonsaiCreated): void {
  let entity = Bonsai.load(event.params._bonsaiId.toString());
    if(entity==null){
        entity =new Bonsai(event.params._bonsaiId.toString());
    }
    entity.careTaker = event.params.caretaker;
    entity.uri = event.params.bonsaiURI;
    entity.botanist = event.params.botanist;
    entity.lastWatered=new BigInt(0);
    entity.consecutiveWaterings=new BigInt(0);
    entity.waterBalance=new BigInt(0);
    entity.lastFertilized=new BigInt(0);
    entity.consecutiveFertilizings=new BigInt(0);
    entity.fertilizerBalance=new BigInt(0);
    entity.lifeStage=new BigInt(0);
    entity.save()
}

export function handleBonsaiDestroy(event: BonsaiDestroy): void {
  let entity = new Destroy(event.params._bonsaiID.toString());
  entity.bonsai = Bonsai.load(event.params._bonsaiID.toString()).id;
  entity.fertilizerBalance = event.params.fertilizerBalance;
  entity.waterBalance = event.params.waterBalance;
  entity.save();

  let entity2 = Bonsai.load(event.params._bonsaiID.toString());
  entity2.fertilizerBalance = event.params.fertilizerBalance;
  entity2.waterBalance = event.params.waterBalance;
  entity2.save();
}

export function handleBonsaiFertilized(event: BonsaiFertilized): void {
  let entity = new Fertilize(event.params._bonsaiId.toString());
  entity.bonsai = Bonsai.load(event.params._bonsaiId.toString()).id;
  entity.fertilizerBalance = event.params.fertilizerBalance;
  entity.consecutiveWaterings = event.params.consecutiveFertilizings;
  entity.lastFertilized = event.params.lastFertilized
  entity.save();

  let entity2 = Bonsai.load(event.params._bonsaiId.toString());
  entity2.fertilizerBalance = event.params.fertilizerBalance;
  entity2.consecutiveWaterings = event.params.consecutiveFertilizings;
  entity2.lastFertilized = event.params.lastFertilized
  entity2.save();
}

export function handleBonsaiGrow(event: BonsaiGrow): void {
  let entity = new Growth(event.params._bonsaiID.toString());
  entity.bonsai = Bonsai.load(event.params._bonsaiID.toString()).id;
  entity.lifeStage = event.params.lifeStage;
  entity.consecutiveWaterings = event.params.consecutiveWaterings;
  entity.uri = event.params._bonsaiURI
  entity.save();

  let entity2 = Bonsai.load(event.params._bonsaiID.toString());
  entity2.lifeStage = event.params.lifeStage;
  entity2.consecutiveWaterings = event.params.consecutiveWaterings;
  entity2.uri = event.params._bonsaiURI
  entity2.save();
}

export function handleBonsaiWatered(event: BonsaiWatered): void {
  let entity = new Water(event.params._bonsaiId.toString());
  entity.bonsai = Bonsai.load(event.params._bonsaiId.toString()).id;
  entity.lastWatered = event.params.lastWatered;
  entity.consecutiveWaterings = event.params.consecutiveWaterings;
  entity.waterBalance = event.params.waterBalance
  entity.save();

  let entity2 = Bonsai.load(event.params._bonsaiId.toString());
  entity2.lastWatered = event.params.lastWatered;
  entity2.consecutiveWaterings = event.params.consecutiveWaterings;
  entity2.waterBalance = event.params.waterBalance
  entity2.save();
}

export function handleBonsaiWilt(event: BonsaiWilt): void {
  let entity = new Wilt(event.params._bonsaiID.toString());
  entity.bonsai = Bonsai.load(event.params._bonsaiID.toString()).id;
  entity.consecutiveFertilizings = event.params.consecutiveFertilizings;
  entity.consecutiveWaterings = event.params.consecutiveWaterings;
  entity.save();

  let entity2 = Bonsai.load(event.params._bonsaiID.toString());
  entity2.consecutiveFertilizings = event.params.consecutiveFertilizings;
  entity2.consecutiveWaterings = event.params.consecutiveWaterings;
  entity2.save();
}

export function handleTransfer(event: Transfer): void {
  let entity = Bonsai.load(event.params.tokenId.toString());
}
