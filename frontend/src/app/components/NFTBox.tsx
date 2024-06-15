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
  watchChainId
} from '@wagmi/core'
import { toast } from 'sonner'
import { parseEther } from "viem/utils";

import {wagmiContractConfig } from "@/app/wagmiConfig"
import { wagmiConfig } from "@/app/wagmiConfig"
export default function NFTBox() {
 
    const { address,isConnected } = useAccount();
    const chainId = useChainId();
    const [image,setImage] = useState(""); 
    const [name,setName] = useState("Mint Your NFT"); 
    return(
        <div className="justify-center">
        <Card className="col-span-12 sm:col-span-4 h-[500px] rounded-lg border-carousel bg-[url('/image/expectrum-1191724_640.png')] bg-center bg-no-repeat">
            <Image 
                className="m-2"
                width={450}
                isZoomed
                alt="NextUI hero Image"
                src={image}
            />
            <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <h2 className="text-white mr-2">{name}</h2>
            </CardFooter>
        </Card>
        <div className="flex m-5 justify-center">
          <div className="mr-5">
          <Button  radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
              Mint NFT <span>0.0005 ETH</span>
          </Button>
          </div>
          <div>
              <Button  radius="full" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                  Replace <span>0.0001 ETH</span>
              </Button>
          </div>                
        </div>
        <Divider />
    </div>

    )
}