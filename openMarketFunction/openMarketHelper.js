const constant = require('../helper/constant');
const express = require('express')
const app = express();
const Web3 = require('web3');
// const testnode = 'https://eth-ropsten.alchemyapi.io/v2/G7HtmM2JAlQC2LKY86nFyIsGa-Umr-oL'
const testnode =  'https://eth-kovan.alchemyapi.io/v2/wWWmTkZXnxYIUiSdqnX_NxwFqIxaUK2y'
const web3 = new Web3(new Web3.providers.HttpProvider(testnode));
const erc20 = new web3.eth.Contract(constant.ERC20ABI, constant.erc20_address);
const nfttoken = new web3.eth.Contract(constant.NFTTokenABI, constant.nfttoken_address);
const openmarketplace = new web3.eth.Contract(constant.OpenMarketplaceABI, constant.openmarketplace_address);
const password = 'bafkreiazkoqwn4sxar7f4f66ic6zuneqgpvh2ym4cwxetc7mk4dyyym55e';



module.exports = {
  /**
   * Function Name : acceptedToken
   * Description   : acceptedToken of this token
   *
   * @return response
  */
  acceptedToken: async (req, res) => {
    try {
      var response = await openmarketplace.methods.acceptedToken().call()
      console.log("acceptedToken ====>>>", response);
      return res.status(200).send({ 'acceptedToken': response, });
    } catch (error) { console.log("error in acceptedToken", error) }
  },

  /**
   * Function Name : owner
   * Description   : owner Address of this contract
   *
   * @return response
  */
  owner: async (req, res) => {
    try {
      var response = await openmarketplace.methods.owner().call()
      console.log("owner ====>>>", response);
      return res.status(200).send({ 'owner': response, });
    } catch (error) { console.log("error in owner", error) }
  },

  /**
   * Function Name :A 
   * Description   : transfer TRVL token  to to address
   *
   * @return response
  */
  nftApprove: async (tokenId) => {
    try {
      // console.log("hello===>");
      // let tokenId = await nfttoken.methods.totalSupply().call()

      console.log("tokenId====>", tokenId);

      const txObject = {
        to: constant.nfttoken_address,
        gas: web3.utils.toHex('20000000000'),
        gasLimit: web3.utils.toHex('5000000'),
        data: nfttoken.methods.approve(constant.openmarketplace_address, Number(tokenId)).encodeABI()
      };


      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      // console.log('signPromise', signPromise);


      console.log("hello===>");

      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction);
      if (receipt.status == true) {
        return receipt;
      } else {
        return receipt.status;
      }
      // .once('confirmation', (confirmationNumber, receipt) => {
      //   if (receipt) {
      //     console.log('receipt', receipt);
      //     return receipt;
      //   }
      //   // return res.status(200).send({ 'result': receipt, });
      // })
    } catch (error) {
      console.log("error in approve", error)
      // return res.status(501).send({ 'error': error.message });
    }
  },


  ercApprove: async (price) => {
    try {
      // console.log("hello===>");
      // let tokenId = await nfttoken.methods.totalSupply().call()

      console.log("tokenId====>", price);
      let priceInWei = await web3.utils.toWei(price, 'ether');

      const txObject = {
        to: constant.nfttoken_address,
        gas: web3.utils.toHex('20000000000'),
        gasLimit: web3.utils.toHex('5000000'),
        data: erc20.methods.approve(constant.openmarketplace_address, priceInWei).encodeABI()
      };


      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      // console.log('signPromise', signPromise);


      console.log("hello===>");

      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      console.log("=====recript",receipt)
      // .once('confirmation', (confirmationNumber, receipt) => {
      //   if (receipt) {
      //     console.log('receipt', receipt);
      //     return receipt;
      //   }
      // return res.status(200).send({ 'result': receipt, });
      // })
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      console.log("error in approve", error)
      // return res.status(501).send({ 'error': error.message });
    }
  },

  /**
   * Function Name : createOrder
   * Description   : createOrder for Nft
   *
   * @return response
  */
  createOrder: async (assetId, price, expiresAt) => {
    //console.log("Hello");



    try {
      let priceInWei = await web3.utils.toWei(price, 'ether');

      let Data = await openmarketplace.methods.createOrder(constant.nfttoken_address, assetId, priceInWei, expiresAt).encodeABI()

      const txObject = {
        to: constant.openmarketplace_address,
        //gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('5000000'),
        data: Data
      };



      //console.log(txObject.data);
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);



      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      // .once('confirmation', (confirmationNumber, receipt) => {
      //   // console.log('receipt', receipt);
      //   return res.status(200).send({ 'result': receipt });
      // })
      if (receipt) {
        return receipt;
      }

      console.log("hello===>");

    } catch (error) {
      console.log("168 >>>>>>>>>>>>>>>>>>... ", error)
      // return res.status(501).send({ 'error ======>': error.message });
    }
  },

  create: async (_metaDataURI, _metaData) => {

    try {
      // _metaDataURI    //i.e fileHash from addImage API
      // _metaData       // tokenName from addNft
      let Data = await nfttoken.methods.create(_metaDataURI, _metaData).encodeABI()

      const txObject = {
        to: constant.nfttoken_address,
        //gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('5000000'),
        data: Data
      };
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      var received;
      // console.log(">>>>>>>>>>>>>. signPromise",signPromise)
      if (signPromise) {
        received = await web3.eth.sendSignedTransaction(signPromise.rawTransaction || signPromise.raw);
        // .once('confirmation', (confirmationNumber, receipt) => {
        //   console.log('receipt', receipt);
        //   console.log("hello===>72");
        //     received=receipt
        //     // return receipt;
        //   // return res.status(200).send({ 'result': receipt });
        // })
        // console.log("hello===>79");
        return received;
      }
    } catch (error) {
      return error;
    }

  },

  /**
     * @dev Update an already published order
     *  can only be updated by seller
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
  */
  updateOrder: async (assetId, price, expiresAt) => {
    try {
      let priceInWei = await web3.utils.toWei(price, 'ether');
      const txObject = {
        to: constant.openmarketplace_address,
        // gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('5000000'),
        data: openmarketplace.methods.updateOrder(constant.nfttoken_address, assetId, priceInWei, expiresAt).encodeABI()
      };
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      // .once('confirmation', (confirmationNumber, receipt) => {
      //   // console.log('receipt', receipt);
      //   return res.status(200).send({ 'result': receipt });
      // })
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      return res.status(501).send({ 'error ======>': error.message });
    }
  },

  /**
       * @dev Cancel an already published order
       *  can only be canceled by seller or the contract owner
       * @param _nftAddress - Address of the NFT registry
       * @param _assetId - ID of the published NFT
       */
  cancelOrder: async (req, res) => {
    try {
      const txObject = {
        to: constant.openmarketplace_address,
        //gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('500000'),
        data: openmarketplace.methods.cancelOrder(req.body.nftAddress, req.body.assetId).encodeABI()
      };
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      // console.log('signPromise', signPromise);
      web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
        .once('confirmation', (confirmationNumber, receipt) => {
          // console.log('receipt', receipt);
          return res.status(200).send({ 'result': receipt });
        })
    } catch (error) {
      return res.status(501).send({ 'error': error.message });
    }
  },

  /**
   * @dev Executes the sale for a published NFT and checks for the asset fingerprint
   * @param _nftAddress - Address of the NFT registry
   * @param _assetId - ID of the published NFT
   * @param _priceInWei - Order price
   * @param _fingerprint - Verification info for the asset
*/
  safeExecuteOrder: async (assetId, price) => {
    try {
      console.log(">>>>>>>>>>>>>>>>>>>> ", assetId, price)
      let priceInWei = await web3.utils.toWei(price, 'ether');
      console.log("priceInWie----", priceInWei)
      const txObject = {
        to: constant.openmarketplace_address,
        // gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('500000'),
        data: openmarketplace.methods.safeExecuteOrder(constant.nfttoken_address, assetId, priceInWei).encodeABI()
      };
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      // console.log('signPromise', signPromise);
      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      // .once('confirmation', (confirmationNumber, receipt) => {
      // console.log('receipt', receipt);
      // return res.status(200).send({ 'result': receipt });
      // })
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      console.log("Catch error >>>> ", error)
      // return res.status(501).send({ 'error': error.message });
    }
  },

  /**
      * @dev Places a bid for a published NFT
      * @param _nftAddress - Address of the NFT registry
      * @param _assetId - ID of the published NFT
      * @param _priceInWei - Bid price in acceptedToken currency
      * @param _expiresAt - Bid expiration time
      */
  safePlaceBid: async (assetId, price, expiresAt,pvtkey) => {
    try {
      let priceInWei = await web3.utils.toWei(price, 'ether');
      const txObject = {
        to: constant.openmarketplace_address,
        // gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('5000000'),
        data: openmarketplace.methods.safePlaceBid(constant.nfttoken_address, assetId, priceInWei, expiresAt).encodeABI()
      };

      const privateKey = decrypt(pvtkey,password)

      const signPromise = await web3.eth.accounts.signTransaction(txObject,privateKey);
      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      return res.status(501).send({ 'error ======>': error.message });

    }
  },

  /**
     * @dev Executes the sale for a published NFT by accepting a current bid
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     * @param _priceInWei - Bid price in wei in acceptedTokens currency
     */

  acceptBid: async (assetId, price) => {
    try {

      let priceInWei = await web3.utils.toWei(price, 'ether');

      const txObject = {
        to: constant.openmarketplace_address,
        // gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('500000'),
        data: openmarketplace.methods.acceptBid(constant.nfttoken_address, assetId, priceInWei).encodeABI()
      };
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      // console.log('signPromise', signPromise);
      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      // .once('confirmation', (confirmationNumber, receipt) => {
      // console.log('receipt', receipt);
      // return res.status(200).send({ 'result': receipt });
      // })
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      console.log("=====336", error)
      return res.status(501).send({ 'error': error.message });
    }
  },


  /**
     * @dev Cancel an already published bid
     *  can only be canceled by seller or the contract owner
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     */
  cancelBid: async (assetId) => {
    try {
      const txObject = {
        to: constant.openmarketplace_address,
        // gas: web3.utils.toHex('100000'),
        gasPrice: web3.utils.toHex('20000000000'),    // Always in Wei
        gasLimit: web3.utils.toHex('500000'),
        data: openmarketplace.methods.cancelBid(constant.nfttoken_address, assetId).encodeABI()
      };
      const signPromise = await web3.eth.accounts.signTransaction(txObject, constant.private_key);
      // console.log('signPromise', signPromise);
      let receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
      // .once('confirmation', (confirmationNumber, receipt) => {
      // console.log('receipt', receipt);
      // return res.status(200).send({ 'result': receipt });
      // })
      if (receipt) {
        return receipt;
      }
    } catch (error) {
      return res.status(501).send({ 'error': error.message });
    }
  }
}





const encrypt = (text, password) => {


  const passwordHash = crypto.createHash('sha256').update(password).digest();
  const secretKey = Buffer.from(passwordHash).toString('hex', 16);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  // return {
  //     iv: iv.toString('hex'),
  //     content: encrypted.toString('hex')
  // };

  return iv.toString('hex') + ':' + encrypted.toString('hex')
};

// Decryption
const decrypt = (hash, password) => {

  // Creaate a buffered secretKey from the password
  const passwordHash = crypto.createHash('sha256').update(password).digest();
  const secretKey = Buffer.from(passwordHash).toString('hex', 16);

  var encryptedArr = hash.split(":")

  const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(encryptedArr[0], 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(encryptedArr[1], 'hex')), decipher.final()]);
  // console.log('decypted', decrpyted.toString());

  return decrpyted.toString();
};