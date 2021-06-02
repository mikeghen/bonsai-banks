from brownie import accounts
import pytest


DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

@pytest.fixture
def weth(Contract):
    yield Contract.from_explorer(DAI_ADDRESS)

@pytest.fixture
def dai(Contract):
    yield Contract.from_explorer(WETH_ADDRESS)


@pytest.fixture
def bbank(BonsaiBank, dai, weth, accounts):
    return BonsaiBank.deploy(dai, weth, {"from": accounts[0]})


@pytest.fixture
def botanist(accounts):
    return accounts[0]


@pytest.fixture
def caretaker(accounts):
    return accounts[1]


def test_account_balance():
    # Canary Test
    balance = accounts[0].balance()
    accounts[0].transfer(accounts[1], "10 ether", gas_price=0)

    assert balance - "10 ether" == accounts[0].balance()

"""
Test Suite Outline
- bonsai can be minted by botanists only
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
