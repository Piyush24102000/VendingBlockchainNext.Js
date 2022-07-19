import "bulma/css/bulma.css"
import Head from 'next/head'
import styles from "../styles/vending.module.css";
import Web3 from "web3";
import { useState,useEffect } from "react";

export default function vending() {
const web3 = new Web3(Web3.givenProvider||'https://rinkeby.infura.io/v3/7f4d230eb9de4fd3abbbd56318fd3eb5')
const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "donutBalances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getVendingBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "restock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "purchase",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    }
  ]
  const address = "0x5024474E4caAc7bb1f78Da4Ec52906de0cB73f92";
  const callContract = new web3.eth.Contract(abi,address)

  const[inventory,setinventory] = useState();
  const[myDonutCount,setmyDonutCount] = useState();
  const[buydonut,setbuydonut] = useState(); //use buydonut as a parameter
  
  useEffect(()=>{ //use effect will fire first when page reloads
    getinventory()
  })
  
  const getinventory = async () => {
    const inventory = await callContract.methods.getVendingBalance().call();
    setinventory(inventory);
  }
  
  const getMyDonutCount = async() => {
    const accounts = await web3.eth.getAccounts();
    const count = await  callContract.methods.donutBalances(accounts[0]).call();
    setmyDonutCount(count);
  }
  getMyDonutCount();

  const updateDonut = event => {    /////Important to
    setbuydonut(event.target.value)
  }
  
  const buyDonutHandler = async()=>{
    const accounts = await web3.eth.getAccounts();
    await callContract.methods.purchase(parseInt(buydonut)).send({
      from: accounts[0],
      value: web3.utils.toWei('2','ether') * buydonut
    })
  }
  

  //Window.ethereum for metamask
    const connectWallet = async() => {
        if(typeof window != "undefined" && typeof window.ethereum != "undefined"){
           await window.ethereum.request({method:"eth_requestAccounts"})
            web3 = new Web3(window.ethereum)
            
            if(window.ethereum != undefined){
                alert("Metamask Connected Please select network")
            }
        }
        else{
            console.log("Install metamask") && alert("Install metamask")
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Vending Blockchain</title>
                <meta name="description" content="A Blockchain vending machine" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Vending Machine</h1>
                    </div>
                    <div className="navbar-end">
                        <button onClick={connectWallet} className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className="container">
                    <h2>Vending Machine Inventory: {inventory}units</h2>
                </div>
            </section>
            <section>
                <div className="container">
                    <h2>My count is:  {myDonutCount} </h2>
                </div>
            </section>
            &nbsp;
            <section>
                <div className="container">
                  <div className="field">
                    <label className="label">Buy donuts</label>
                    <div className="control">
                      <input onChange={updateDonut} className="input"  />
                    </div>
                    <div>&nbsp;</div>
                    <button onClick={buyDonutHandler} className="button is-primary">Buy</button>

                  </div>
                </div>
            </section>
        </div>
    )
}