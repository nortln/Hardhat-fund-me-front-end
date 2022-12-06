import { ethers, providers } from "./ethers.5.6.esm.min.js"
import {abi, contractAddress} from "./constant.js"


const connectButton = document.getElementById("connectButton") 
const fundButton = document.getElementById("fund")  
const balanceButton = document.getElementById("balanceButton")  
const withdrawButton = document.getElementById("withdrawButton")  

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({method: "eth_requestAccounts"})
    connectButton.innerHTML = "Connected"
} else {
    connectButton.innerHTML = "Please Install Metamask"
}
}

async function getBalance() {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("amount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        // signer / wallet / someone with gas
        // contract that we are interacting with
        // ABI and Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            // listen for the tx to be mined
            // listen for an event 
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done")
        }catch(error) {
            console.log(error)
        }
        
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)    
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(`Completed with ${transactionReciept.confirmations} confirmations`)
            resolve()
        })
    })
    
}

const withAmount = document.getElementById("withdraw").value

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch(error) {
            console.log(error)
        }
    }
}