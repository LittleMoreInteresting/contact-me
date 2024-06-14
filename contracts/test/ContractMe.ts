import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { getAddress, parseEther } from "viem";

  describe("ContractMe", function () {
    async function deployContractMeFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();
    
        const CM = await hre.viem.deployContract("ContractMe");
    
        const publicClient = await hre.viem.getPublicClient();
    
        return {
            CM,
          owner,
          otherAccount,
          publicClient,
        };
    }

    describe("Deployment", function () {
        it("Init ", async function () {
          const { CM, owner,publicClient } = await loadFixture(deployContractMeFixture);
    
          expect(await CM.read.mintPrice()).to.equal(parseEther("0.0005"));
        });
        it("SetPrice",async function () {
            const { CM, owner,publicClient } = await loadFixture(deployContractMeFixture);
            await CM.write.setPrice([parseEther("0.005")])
            expect(await CM.read.mintPrice()).to.equal(parseEther("0.005"));
        })
    });

    describe("Mint NFT",function (){
        it("mint first",async function(){
            const { CM, owner,publicClient } = await loadFixture(deployContractMeFixture);
            await expect(CM.write.mint(["horace","a","b","c"])).to.be.rejected;
            const price = await CM.read.mintPrice();
            await CM.write.mint(["horace","a","b","c"],{
              value:price
            })
            expect(await CM.read.balanceOf([owner.account.address])).to.equal(1n)
            const tokenId = await CM.read.userTokens([owner.account.address])
            const [card,isOwner] = await CM.read.starWork([tokenId]);
            expect(card.name).equal("horace")
            console.log(await publicClient.getBalance(CM),isOwner)
            // modify
            await CM.write.modifyCard(["horace-2024","d","e","f"])
            const [cardNew,isOwnerNew] = await CM.read.starWork([tokenId]);
            expect(cardNew.name).equal("horace-2024")
            console.log(cardNew,isOwnerNew)
        })
    });
  })