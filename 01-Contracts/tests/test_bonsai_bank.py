from brownie import accounts
from brownie.network.state import Chain
import pytest

"""
TODO:
- Stage caretaker with DAI and WETH needed
"""


DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
SEVEN_DAYS = 60 * 60 * 24 * 7 + 60    # plus 1 min. on each
THIRTY_DAYS = 60 * 60 * 24 * 30 + 60

@pytest.fixture
def chain(Chain):
    return Chain()


@pytest.fixture
def weth(Contract):
    yield Contract.from_explorer(DAI_ADDRESS)

@pytest.fixture
def dai(Contract):
    yield Contract.from_explorer(WETH_ADDRESS)


@pytest.fixture
def bbank(BonsaiBank, accounts):
    return accounts[0].deploy(BonsaiBank)


@pytest.fixture
def botanist(accounts):
    return accounts[0]


@pytest.fixture
def caretaker(accounts):
    return accounts[1]


@pytest.fixture
def bonsai_wither(bbank, caretaker, botanist, chain):
    # Return the tokenId of a basic bonsai
    bonsai_uri = "ipfs://wwww"
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist})
    water_rate = bbank.waterRate()
    dai.appove(bbank.address, water_rate, {"from": caretaker})
    bbank.water(bonsai_id)
    chain.sleep(THIRTY_DAYS)
    return bonsai_id


@pytest.fixture
def bonsai_grow(bbank, caretaker, botanist, chain):
    # Return the tokenId of a bonsai ready to grow
    bonsai_uri = "ipfs://gggg"
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist})
    fert_rate = bbank.fertRate()
    water_rate = bbank.waterRate()
    # Tend to the bonsai for 3 months, 5 weeks per month
    for i in range(0, 3): # 3 months
        weth.appove(bbank.address, fert_rate, {"from": caretaker})
        bbank.fertilize(bonsai_id)
        for j in range(0,5): # 5 weeks each month
            dai.appove(bbank.address, water_rate, {"from": caretaker})
            bbank.water(bonsai_id)
            chain.sleep(SEVEN_DAYS)

    return bonsai_id

# Canary Test
def test_account_balance():
    balance = accounts[0].balance()
    accounts[0].transfer(accounts[1], "10 ether", gas_price=0)
    assert balance - "10 ether" == accounts[0].balance()

"""
Test Suite Outline
- bonsai can be minted
- bondai can only be minted by the botanist
- bonsai can be watered
- bonsai can only be watered every 7 days
- bonsai can be fertilized
- bonsai can only be fertilized every 7 days
- bondai can grow
- bonsai can only grow after 90 days of tending
- bonsai can wither
- bonsai can only wither after 14 days without water
- bonsai can be destroyed to recover the funds
"""

# bonsai can be minted
def test_mint_bonsai(bbank, caretaker, botanist):
    # Check that a new minted bonsai is created with all the right properties
    bonsai_uri = "ipfs://aaaa"
    # Mint a new token to the caretaker directly
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist}).return_value
    # Check properties were done correctly
    assert bonsai_id == 1
    assert bbank.lastWatered(bonsai_id) == 0
    assert bbank.consecutiveWaterings(bonsai_id) == 0
    assert bbank.waterBalance(bonsai_id) == 0
    assert bbank.lastFertilized(bonsai_id) == 0
    assert bbank.consecutiveFertilizings(bonsai_id) == 0
    assert bbank.fertilizerBalance(bonsai_id) == 0
    assert bbank.lifeStage(bonsai_id) == 0
    assert "ipfs://aaaa" == bbank.tokenURI(bonsai_id)

# bonsai can only be minted by the botanist
def test_mint_not_botanist(bbank, dai, weth, caretaker, botanist):
    # Check that a new minted bonsai is created with all the right properties
    bonsai_uri = "ipfs://aaaa"
    # Mint a new token as the caretaker and revert
    with brownie.reverts():
        bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": caretaker})

# bonsai can be watered
def test_watering(bbank, dai, weth, caretaker, botanist):
    bonsai_uri = "ipfs://aaaa"
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist})
    water_rate = bbank.waterRate()
    dai.approve(bbank.address, water_rate)
    starting_dai = dai.balanceOf(caretaker)
    bbank.water(bonsai_id, {"from": caretaker})
    ending_dai = dai.balanceOf(caretaker)
    assert starting_dai - ending_dai == water_rate
    assert 0 != bbank.lastWatered(bonsai_id)
    assert 1 == bbank.consecutiveWaterings(bonsai_id)
    assert 0 == bbank.waterBalance(bonsai_id)
    assert 0 == bbank.fertilizerBalance(bonsai_id)

# bonsai can only be watered every 7 days
def test_watering_early(bbank, dai, weth, caretaker, botanist):
    bonsai_uri = "ipfs://aaaa"
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist})
    water_rate = bbank.waterRate()
    dai.approve(bbank.address, water_rate)
    bbank.water(bonsai_id, {"from": caretaker})
    # Second watering will revert bc it hasn't been 7 days
    with brownie.reverts():
        bbank.water(bonsai_id, {"from": caretaker})

# bonsai can be fertilized
def test_fertilizing(bbank, dai, weth, caretaker, botanist):
    bonsai_uri = "ipfs://aaaa"
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist})
    fert_rate = bbank.fertRate()
    weth.approve(bbank.address, fert_rate)
    starting_weth = weth.balanceOf(caretaker)
    bbank.fertilize(bonsai_id, {"from": caretaker})
    ending_weth = weth.balanceOf(caretaker)
    assert starting_weth - ending_weth == fert_rate
    assert 0 != bbank.lastFertilized(bonsai_id)
    assert 1 == bbank.consecutiveFertilizings(bonsai_id)
    assert 0 == bbank.waterBalance(bonsai_id)
    assert 0 == bbank.fertilizerBalance(bonsai_id)

# bonsai can only be fertilized every 30 days
def test_fertilizing_early(bbank, dai, weth, caretaker, botanist):
    bonsai_uri = "ipfs://aaaa"
    bonsai_id = bbank.mint(caretaker, bonsai_uri, {"from": botanist})
    fert_rate = bbank.fertRate()
    dai.approve(bbank.address, water_rate)
    bbank.fertilize(bonsai, {"from": caretaker})
    # Second fertilizing will revert bc. it hasn't been 30 days
    with brownie.reverts():
        bbank.fertilize(bonsai, {"from": caretaker})

# bondai can grow
def test_grow(bbank, dai, weth, caretaker, botanist, bonsai_grow):
    new_bonsai_uri = "ipfs://nnnn"
    bbank.grow(bonsai_grow, new_bonsai_uri, {"from": botanist})
    ending_weth = weth.balanceOf(caretaker)
    # Resets params
    assert 0 == bbank.consecutiveWaterings(bonsai_id)
    assert 0 == bbank.consecutiveFertilizings(bonsai_id)
    assert ["ipfs://gggg", new_bonsai_uri] == bbank.bonsaiUris(bonsai_id)
    assert 1 == bbank.lifeStage(bonsai_id)

# bonsai can only grow after 90 days of tending
def test_grow_early(bbank, dai, weth, caretaker, botanist, bonsai_grow):
    new_bonsai_uri = "ipfs://nnnn"
    bbank.grow(bonsai_grow, new_bonsai_uri, {"from": botanist})
    # Second fertilizing will revert bc. it hasn't been 30 days
    with brownie.reverts():
        bbank.grow(bonsai_grow, new_bonsai_uri, {"from": botanist})


# bonsai can wither
def test_wither(bbank, dai, weth, caretaker, botanist, bonsai_wither):
    nft_dai = bbank.waterBalance(bonsai_id)
    nft_weth = bbank.fertilizerBalance(bonsai_id)
    bot_dai_bal_starting = dai.balanceOf(botanist)
    bot_weth_bal_starting = weth.balanceOf(botanist)
    bbank.wither(bonsai_wither, {"from": botanist})
    ending_weth = weth.balanceOf(caretaker)
    bot_dai_bal_ending = dai.balanceOf(botanist)
    bot_weth_bal_ending = weth.balanceOf(botanist)
    assert bot_dai_bal_starting - bot_dai_bal_ending == nft_dai * 0.95
    assert bot_weth_bal_starting - bot_weth_bal_ending == nft_weth * 0.95
    assert 0 == bbank.consecutiveWaterings(bonsai_id)
    assert 0 == bbank.consecutiveFertilizings(bonsai_id)


# bonsai can only wither after 14 days without water
def test_wither_early(bbank, dai, weth, caretaker, botanist, bonsai_wither):
    bbank.wither(bonsai_wither, {"from": botanist})
    # Second fertilizing will revert bc. it hasn't been 30 days
    with brownie.reverts():
        bbank.wither(bonsai_wither, {"from": botanist})

# bonsai can be destroyed to recover the funds
def test_destroy(bbank, dai, weth, caretaker, botanist, bonsai_wither):
    bonsai_dai = bbank.waterBalance(bonsai_id)
    bonsai_weth = bbank.fertilizerBalance(bonsai_id)
    dai_bal_starting = dai.balanceOf(botanist)
    weth_bal_starting = weth.balanceOf(botanist)
    bbank.destroy(bonsai_grow, {"from":caretaker})
    dai_bal_ending = dai.balanceOf(botanist)
    weth_bal_ending = weth.balanceOf(botanist)
    assert dai_bal_starting - dai_bal_ending == bonsai_dai
    assert weth_bal_starting - weth_bal_ending == bonsai_weth
    assert 0 == bbank.waterBalance(bonsai_id)
    assert 0 == bbank.fertilizerBalance(bonsai_id)
