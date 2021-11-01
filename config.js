const config = {
  
    // web3 config
    web3: {
      // rpcAddress: 'http://crypto-testnets.sofodev.co:38545'
      // rpcAddress: 'https://ropsten.infura.io/v3/8b1d299cb9ef43d4854cb635c3ffa329'
      rpcAddress: 'http://localhost:8013'
    },
    txType : { 
      mint : { 'AP': 4 , 'PGD':5 , 'SELF': 2 }
    },
    // coin config
    oToken: {
  
      abi: require('./configContract').abi,
      address: require('./configContract').address,
      decimals: 10 ** 8,
      commission: 0.01,
      CRWWallet: '0xb7EfCa01EE7329e9BC95acf1240eF2fd962AC3Ed'
    },
  
    suspenseWallet: {
      abi: [{ "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }, { "name": "_user", "type": "address" }], "name": "burnToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_tokenAddress", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferAnyERC20Token", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_otAddress", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }],
      address: '0x688c56739b330c1d43a199b33ad3342c6e0058c3'
    },
  
    adminAccounts: {
  
      lp_wallet_pvt_key: 'lp_wallet_pvt_key.pem',
      central_expense_wallet_pvt_key: 'central_expense_wallet_pvt_key.pem',
      minter_wallet_pvt_key: 'minter_wallet_pvt_key.pem',
      central_revenue_wallet_pvt_key: 'central_revenue_wallet_pvt_key.pem',
      escrow_wallet_pvt_key: 'escrow_wallet_pvt_key.pem',
      admin_contract_wallet_pvt_key: 'admin_contract_wallet_pvt_key.pem',
      dummy_wallet_pvt_key: 'dummy_wallet_pvt_key.pem',
      suspense_wallet_issuer_pvt_key: 'central_expense_wallet_pvt_key.pem',
  
      LP_PRIVATE_KEY: '0xcba6cad56bfa58b2b78ea5ce3ab911d487d558e853932891fe8c5db7376b3c12',
  
      DUMMY_ACCOUNT: '0xe0758e42b88261a58d84C82ab0bf4Ed03fF9f5F6',
      DUMMY_PVT_KEY: 'cba6cad56bfa58b2b78ea5ce3ab911d487d558e853932891fe8c5db7376b3c12',
      DUMMY_ACCOUNT2: "0xb7EfCa01EE7329e9BC95acf1240eF2fd962AC3Ed",
  
      SUSPENSE_WALLET_ISSUER_ACCOUNT: '0x03dbF692822561912F815dbb005Cc21630CF8F8D',
      SUSPENSE_WALLET_ISSUER_PVT_KEY: 'aa8e2b4295e96b28d3048133eb43d3090eb331e5ac555cf7f764baf0701e4b9d',
  
      ISSUER_ACCOUNT: '0x7856dfc397fe666bae05ca8130d4da9b1ba7713c',
      ISSUER_PVT_KEY: '160AD3E552D05289836BFBDACD37F600658FD123E2A8EEF521F7BB5E9EA9DD39',
  
      cew: "0x03dbF692822561912F815dbb005Cc21630CF8F8D",
      cew_pvtkey: "aa8e2b4295e96b28d3048133eb43d3090eb331e5ac555cf7f764baf0701e4b9d",
  
      // cew : "0xcee6a0cca4884aa61e63693db080810460f4a6fd",
      // cew_pvtkey : "73c7eb808e889d27bb3707e47226765ce47a8b7301fd3c28024d08e51501e75c",  
  
      minter: "0x4cFE11fA4a4F2647dCd62562aC58D46958337BB1",
      minter_pvtkey: "cdb0be4c5cc89e9bddd0b578250e49442103891b13096fe4d164bcbe053df43f",
  
      crw: "0xb7EfCa01EE7329e9BC95acf1240eF2fd962AC3Ed",
      crw_pvtkey: "d87693290967d4419c1a9fc74229703d732e6b3a63dfd26d692ba5482cbc43ef",
  
      excrowWallet: "0x5B3Dcb13baF144ce5E985eF3A734aC514e3dB988",
      escrowWallet_pvtkey: "e75fcc70bea6aa32121d87496e6c121b73f739e7d58fe6e61f7f1daa0429d044",
    },
  
    wallets: {
      suspenseWallet: require('./configContract').addressSuspenseWallet
    },
  
    addtionalFee: {
      additionGas: 10000,
      additionGasPrice: 5000000000
    },
  
    TX_STATUS: { INITIATED: 'INITIATED', PENDING: 'PENDING', COMPLETED: 'COMPLETED', FAILED: 'FAILED', UNKNOWN: 'UNKNOWN' },
    TX_TYPE: { MINT: 'MINT', REDEEM: 'REDEEM', BURN: 'BURN', TRANSFER: 'TRANSFER' },
    PLATFORM_ID: { OLGCPLATFORM: 1, SAWTOOTH: 2 },
  
    TX_STATUS_ENUM: ['INITIATED', 'PENDING', 'COMPLETED', 'FAILED'],
    TX_TYPE_ENUM: ['MINT', 'SUSPENSEWALLET', 'BURN'],//simple transefer ,
    TX_SUBTYPE_ENUM: ['FIAT', 'GOLDCOIN'],
    //PLATFORM_ID: [OLGCPLATFORM, SAWTOOTH],
  
    platformDetails: {
      '1': {
        notificationUrl: '',
      }
    },
  
  
  
    // cpatcha
    captcha_secret_key: '6LeNPFUUAAAAAPE3Kq34lDnUh5dzfiSxAKLjdSOu',
  
    // General Config
    recordLimit: 20,
    linkExpireTime: 20, // time after which validation links will expire
    apiAccessKey: 'eedeiKu1uZoh2NooRai7Udaeohtheu7A',
    deplayInTransferAPI: 120,  // delay in seconds
    priceinEur: 0.5,
    maxFileSize: 1000000,
    jwtTokenExpireTime: 60 * 60 * 24,//2 hr
  
  
    // validation types (used in email verifications)
    validationTypeEnum: {
      "EMAILVERIFICATION": 1,
      "LOGINPASSWORDVERIFY": 2
    },
  
    secret: 'ckbdcbkdbcdsc9868i95rrf7',
    supplyChainSecret: 'ckbdcbkdbcdsc9868i95rrf7',
    ledegerSyncAesKey: '152408c56d51a8ff8db2f4d08c88ed29fd5af15a34c5bbd58402fc2b82eefc93',
    ledegerSyncSecret: "152408c56d51a8ff8db2f4d08c88ed29fd5af15a34c5bbd58402fc2b82eefc93",
    cronSecret: "46294A404E635266556A586E327235753878214125442A472D4B615064536756",
  
    LP_PRIVATE_KEY: '0xcba6cad56bfa58b2b78ea5ce3ab911d487d558e853932891fe8c5db7376b3c12',
    WALLET_BUCKET_NAME: 'olegacy-keys/system_wallet_key',
  
    lp_wallet_pvt_key: 'lp_wallet_pvt_key.pem',
    central_expense_wallet_pvt_key: 'central_expense_wallet_pvt_key.pem',
    minter_wallet_pvt_key: 'minter_wallet_pvt_key.pem',
    central_revenue_wallet_pvt_key: 'central_revenue_wallet_pvt_key.pem',
    escrow_wallet_pvt_key: 'escrow_wallet_pvt_key.pem',
  
    accessKeyId: "AKIARSQAJVZKCY2CSCDY",
    secretAccessKey: "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",
    encryptConfig: {
      algorithmEncypt: 'aes256',
      secure_key: '1b15caf8b2fe33f2e7fa19c43bd96e8fef9a1fb0d1d7541b48a3bb59b9501786'
    },
    olegacy_contact_details: {
      email: "olegacy-info@olegacy.com",
      address: "plot no. 007 Dubai"
    },
    secretKey: "6LderLMUAAAAAFE03nf2D9IdKoAwb3nADVohX3hW",
    verificationUrl: "https://www.google.com/recaptcha/api/siteverify?secret=",
    is_captcha_required: true,
    headersSetting: {
      httpOnly: true,
      maxAge: 7776000,
      enforce: true,
      cookieParserSecret: 'olegacy'
    },
    server: "A",
    adminEmails: {
      minterEmail: "issuer@yopmail.com",
      noEmailFound: "nomailfoundsender@yopmail.com"
    },
    adminSecret: "9QEiUmmJVjJRyrEF",
    unblockUserTime: 30 * 60 * 1000,
    password_crypt_no: 14,
    walletapitoken: "XF4FtdcQ8RkxxDHHAdBJHQHGGxSCCuNUwTKFCeNv4TyzmGEYaILd3oMzXGpH4whz"
  }
  
  module.exports = config
  