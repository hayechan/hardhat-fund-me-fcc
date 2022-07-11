const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.05")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund and withdraw", async function () {
              const response = await fundMe.fund({ value: sendValue })
              let balance = await fundMe.provider.getBalance(fundMe.address)
              console.log(`contract balance after fund: ${balance.toString()}`)
              await response.wait(1)
              balance = await fundMe.provider.getBalance(fundMe.address)
              console.log(`contract balance after wait: ${balance.toString()}`)
              await fundMe.withdraw()
              balance = await fundMe.provider.getBalance(fundMe.address)
              console.log(
                  `contract balance after withdraw: ${balance.toString()}`
              )
              assert.equal(balance.toString(), 0)
          })
      })
