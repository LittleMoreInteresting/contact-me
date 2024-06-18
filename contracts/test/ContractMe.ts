import {
    loadFixture,
    time,
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
            const card = await CM.read.starOf([tokenId]);
            expect(card.name).equal("horace")
            console.log(await publicClient.getBalance(CM))
            // modify
            const modifyPrice = await CM.read.modifyPrice();
            await CM.write.modify(["horace-2024","d","e","f"],{
              value:modifyPrice
            })
            const cardNew = await CM.read.starOf([tokenId]);
            expect(cardNew.name).equal("horace-2024")
            console.log(cardNew)
        })
    });
    describe("Star Work",function(){
      it("mint and star work",async function(){
        const { CM,owner } = await loadFixture(deployContractMeFixture);
        
        const price = await CM.read.mintPrice();
        const accounts = await owner.getAddresses()
        for(let i=0;i<accounts.length;i++){
          const addr = accounts[i];
          await CM.write.mint(["a"+addr,"a"+i,"b"+i,"c"+i],{
            value:price,
            account:addr,
          })
        }
        
        for(let i=0;i<accounts.length;i++){
          let s =  await CM.read.starWalk();
          await time.increase(1);
          
          console.log(i,s);
        }
        
      })
    });
  })
 