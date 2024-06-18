'use client'
import {Image} from "@nextui-org/image";
import {Button, Card,CardFooter,Divider} from "@nextui-org/react";
import React, {useState} from "react";
import {GithubOutlined,XOutlined,MailOutlined,NumberOutlined,UserOutlined } from "@ant-design/icons";
import { 
    readContract,
    waitForTransactionReceipt,
    multicall
} from '@wagmi/core'
import {
  useAccount,
  useChainId,
  type BaseError,
  useWriteContract
} from "wagmi";
import {wagmiContractConfig } from "@/app/wagmiConfig"
import { wagmiConfig } from "@/app/wagmiConfig"
export default function FoundBox() {
    const { address,isConnected } = useAccount();
    const [tokenId,settokenId] = useState("");
    const [image,setimage] = useState("");
    const [email,setemail] = useState("");
    const [name,setname] = useState("");
    const [github,setgithub] = useState("");
    const [xAccount,setxAccount] = useState("");
    async function starWalk(){
        if (!isConnected){
            return
        }
        const {tokenId,name,github,x,email} = await readContract(wagmiConfig,{
            ...wagmiContractConfig,
            functionName: 'starWalk',
            args: [],
            account:address
        })
        setname(name)
        setgithub(github)
        setxAccount(x)
        setemail(email)
        settokenId(tokenId.toString())
        const tokenUri = await readContract(wagmiConfig,{
            ...wagmiContractConfig,
            functionName: 'tokenURI',
            args: [tokenId],
            account:address
        })
        setimage(tokenUri)
    }
    return(
        <>
    
        <div className="justify-center">
            <Card className="col-span-12 sm:col-span-4 h-[500px] rounded-lg  border-carousel ">
                <Image 
                    className="m-2"
                    width={450}
                    isZoomed
                    alt="NextUI hero Image"
                    src={image===""?"/image/bg-find.png":image}
                />
                <CardFooter className="absolute flex flex-col items-start pl-5 rounded-br-sm rounded-bl-sm bg-black/60 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                {name==="" && 
                <h2 className="text-white">Mint Your NFT</h2>
                }
                {name!=="" && 
                    <>
                        <h2 className="text-white"><NumberOutlined className="mr-3" />{tokenId}</h2>
                        <h2 className="text-white"><UserOutlined className="mr-3" />{name}</h2>
                        <h2 className="text-white"><MailOutlined className="mr-3" />{email}</h2>
                        <h2 className="text-white"><GithubOutlined className="mr-3" />{github}</h2>
                        <h2 className="text-white"><XOutlined className="mr-3" />{xAccount}</h2>
                    </>
                }
                </CardFooter>
            </Card>
            <div className="flex m-5 justify-center">
                <div className="mr-5">
                    <Button onClick={starWalk} isDisabled={!isConnected} radius="full" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                        Find 
                    </Button>
                </div>
            </div>
            <Divider />
        </div>
    </>

    )
}
