const BSCSwapAgentABI = require('../config/BSCSwapAgent_ABI.json');
const EthSwapAgentABI = require('../config/EthSwapAgent_ABI.json');

const TokenValue = '5000';

// const BinanceTokenAddress = '0xa428Ac85dbF40047645e18866E70D27103091355';
// const ETHswap = '0x7e88b147c21C752e0aBe04aC93f086d678dD023d';

// const ETHTokenAddress = '0x831168e04047d881968d236249689cc001a6da08';
// const BSCswap = '0xaB36d9EBAa54950b8C23986DC23000b5F46dc4DF';

// const AdminAddress = '0x9f5AE75b8852421c729B85611F6A2B605B5f8C3d';
// const AdminPriKey = '06b26d1de80a2dd96b2ca9fcbb1a53380109bf777198add31820566dc2bcc504';



//***********************************************New testing data*********************/
const BinanceTokenAddress = '0xf30F342ACBecEb549077BDFEC015cD60ba39B8Db';
const ETHswap = '0xDfe202020e9CB409b33082BdDA5406534276Dc71';

const ETHTokenAddress = '0x20eF7F61975B3b676dC81011dBA28C4cC285E82f';

const MaticTokenAddress = '0x3A99A3B0151457377281d41aEf46Ab2b4f263f6A';
const Maticswap = '0x5A4C95E0aDC0263eA4FF4Aca5a2e78a1e619A6f3';

const BSCswap = '0x033669D1000D5045f8fF13295e502aFF37bB0f76';

const AdminAddress = '0xEd27E5c6CFc27b0b244c1fB6f9AE076c3eb7C10B';
const AdminPriKey = 'f356e73555f3f2ba4b063a34ffa795b6b7a267f9d2a9618a93d8e3cc80f16c38';


//**************************************************************************************** */


const BSCSwapAgentABIData = BSCSwapAgentABI;
const EthSwapAgentABIData = EthSwapAgentABI;
const MATICSwapAgentABIData = EthSwapAgentABI;


// const EthereumChainId = 1;
// const BinanceChainId = 56;
// const binanceNode = 'https://bsc-dataseed1.ninicoin.io';
// const ethNode = 'https://mainnet.infura.io/v3/e6d9371c89484a369ca2f34df60537ea';

//**********************************************new testing data******************/
const EthereumChainId = 42;
const BinanceChainId = 97;
const MaticChainId = 80001;

const binanceNode = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const ethNode ='https://kovan.infura.io/v3/e6d9371c89484a369ca2f34df60537ea';
const maticNode = 'https://rpc-mumbai.maticvigil.com/';

//*********************************************************************************/

module.exports = {
    TokenValue,
    BinanceTokenAddress,
    ETHswap,
    ETHTokenAddress,
    BSCswap,
    AdminAddress,
    AdminPriKey,
    EthereumChainId,
    BinanceChainId,
    BSCSwapAgentABIData,
    EthSwapAgentABIData,
    binanceNode,
    ethNode,
    MaticTokenAddress,
    Maticswap,
    MATICSwapAgentABIData,
    MaticChainId,
    maticNode

}






