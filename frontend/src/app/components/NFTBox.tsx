'use client'
import {Image} from "@nextui-org/image";
import {Button, Card,CardFooter,CardBody,Divider} from "@nextui-org/react";
import React, {useState, useEffect, useRef, cache} from "react";
import {
  useAccount,
  useChainId,
  type BaseError,
  useWriteContract
} from "wagmi";
import {  } from '@wagmi/core'
import { 
  readContract,
  waitForTransactionReceipt,
  watchContractEvent,
  watchChainId,
  multicall
} from '@wagmi/core'
import {Modal,
    ModalContent,
    ModalHeader,
    ModalBody, 
    ModalFooter, 
    useDisclosure, 
    Checkbox,
    Input,
    Link
} from "@nextui-org/react";

import { toast } from 'sonner'
import { parseEther,formatEther,parseGwei } from "viem/utils";

import {wagmiContractConfig } from "@/app/wagmiConfig"
import { wagmiConfig } from "@/app/wagmiConfig"
import { setAutomine } from "viem/actions";
export default function NFTBox() {
 
    const { address,isConnected } = useAccount();
    const chainId = useChainId();
    const [image,setImage] = useState("");
    const [isMinted,setIsMinted] = useState(false);
    const [mintPrice,setMintPrice] = useState(BigInt(0));
    const [modifyPrice,setModifyPrice] = useState(BigInt(0)); 
    const [TOKEN_ID,setTOKEN_ID] = useState(BigInt(0))
    const {isOpen, onOpen,onClose, onOpenChange} = useDisclosure();
    const [name,setName] = useState("");
    const [github,setGithub] = useState("");
    const [xAccount,setXAccount] = useState("");
    const [email,setEmail] = useState("");

    const getAccountBalance = async ()=>{
        const [balance,token,mintPrice,modifyPrice] = await  multicall(wagmiConfig,{
            contracts:[
                {
                    ...wagmiContractConfig,
                    functionName: 'balanceOf',
                    args: [address as `0x${string}`],
                },
                {
                    ...wagmiContractConfig,
                    functionName: 'userTokens',
                    args: [address as `0x${string}`],
                },
                {
                    ...wagmiContractConfig,
                    functionName: 'mintPrice',
                    args: [],
                },
                {
                    ...wagmiContractConfig,
                    functionName: 'modifyPrice',
                    args: [],
                }
            ]
        })
        if (balance.status === "success" && balance.result>0){
            setIsMinted(true);
        }
        if(token.status === "success" && token.result > 0){
            const tokenId = token.result;
            setTOKEN_ID(tokenId);
            if(tokenId > 0 ){
                const [star,tokenUri] = await  multicall(wagmiConfig,{
                    contracts:[
                        {
                            ...wagmiContractConfig,
                            functionName: 'starWork',
                            args: [tokenId],
                        },
                        {
                            ...wagmiContractConfig,
                            functionName: 'tokenURI',
                            args: [tokenId],
                        },
                    ]
                })
                if (tokenUri.status === "success"){
                    setImage(tokenUri.result)
                }
                if(star.status === "success"){
                    const [fields,] = star.result
                    const {name,github,x,email} = fields;
                    setName(name)
                    setGithub(github)
                    setXAccount(x)
                    setEmail(email)
                }
                console.log(tokenUri,star)
            }
            
        }
        if (mintPrice.status === "success"){
            setMintPrice(mintPrice.result)
        }
        if (modifyPrice.status === "success"){
            setModifyPrice(modifyPrice.result)
        }
        console.log(balance,token,mintPrice,modifyPrice);
    }
    
    
    // Mint start
    
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract({
        mutation:{
            onSuccess:async (hash, variables) => {
                if (hash){
                    toast.info("Transaction Hash:"+hash)
                }
                const listReceipt = await waitForTransactionReceipt(wagmiConfig,{
                    hash
                })
                if (listReceipt.status == "success"){
                    toast.success("mint success !!!")
                    setIsMinted(true)
                    
                }
            }
        }
    })
    if (error) {
        console.log(error)
        toast.error("Error: "+((error as BaseError).shortMessage || error.message))
    }
    async function mintNft() {
        if (!isConnected){
            toast.error("Not connected.")
            return
        }
        if(name.trim() === "" || email.trim() === ""){
            toast.error("place input your name && email .")
            return
        }
        writeContract({
          ...wagmiContractConfig,
          functionName: 'mint',
          args: [name,github,xAccount,email],
          value: mintPrice,
          gasPrice:parseGwei("20")
        })
        onClose();
    }
    const clearVal = ()=>{
        setName("");
        setGithub("");
        setXAccount("");
        setEmail("");
    }
    console.log(TOKEN_ID)
    useEffect(()=>{
        if(isConnected){
            getAccountBalance()
        }
        //setMinted(false);
    },[address, chainId])
    return(
        <>
        
    
        <div className="justify-center">
            <Card className="col-span-12 sm:col-span-4 h-[500px] rounded-lg  border-carousel bg-[url('/image/expectrum-1191724_640.png')] bg-center bg-no-repeat">
                <Image 
                    className="m-2"
                    width={450}
                    isZoomed
                    alt="NextUI hero Image"
                    src={image}
                />
                <CardFooter className="absolute flex flex-col justify-start rounded-br-sm rounded-bl-sm bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <h2 className="text-white mr-2">TokenID: {TOKEN_ID.toString()}</h2>
                <h2 className="text-white mr-2">Name:{name===""?"Mint Your NFT":name}</h2>
                <h2 className="text-white mr-2">Email:{email}</h2>
                <h2 className="text-white mr-2">{github}</h2>
                <h2 className="text-white mr-2">{xAccount}</h2>
                </CardFooter>
            </Card>
            <div className="flex m-5 justify-center">
            <div className="mr-5">
                <Button  onPress={onOpen} isLoading={isPending} isDisabled={isMinted}  radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
                    Mint NFT <span>{formatEther(mintPrice)} ETH</span>
                </Button>
            </div>
            <div>
                <Button onClick={()=>{console.log("Look For")}}  isDisabled={!isMinted} radius="full" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                Find <span>{formatEther(modifyPrice)} ETH</span>
                </Button>
            </div>
            </div>
            <Divider />
        </div>
        <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        onClose={clearVal}
      >
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-r">Contact Me</ModalHeader>
              <ModalBody>
                <Input
                    type="text"
                    isRequired
                    label="Name"
                    variant="bordered"
                    placeholder="Please enter a your name"
                    errorMessage="Please enter a your name"
                    className="max-w-xs"
                    value={name}
                    onValueChange={setName}
                />
                <Input
                    type="email"
                    label="Email"
                    isRequired
                    variant="bordered"
                    placeholder="Please enter a  email"
                    errorMessage="Please enter a valid email"
                    className="max-w-xs"
                    value={email}
                    onValueChange={setEmail}
                />
                 <Input
                    type="text"
                    label="Github"
                    variant="bordered"
                    placeholder="Please enter a  Github"
                    className="max-w-xs"
                    value={github}
                    onValueChange={setGithub}
                />
                 <Input
                    type="text"
                    label="X"
                    variant="bordered"
                    placeholder="Please enter a  X account"
                    className="max-w-xs"
                    value={xAccount}
                    onValueChange={setXAccount}
                />
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={mintNft}>
                  Mint Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>

    )
}
