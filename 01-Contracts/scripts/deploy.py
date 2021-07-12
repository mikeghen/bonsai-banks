from brownie import BonsaiBank, accounts

def main():
    # accounts[0].deploy(AdvisoryToken)
    # acct = accounts.load('test_account')
    BonsaiBank.deploy(accounts[0],{'from': accounts[0]})
    