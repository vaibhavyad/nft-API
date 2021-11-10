const router = require("express").Router();
const nftController = require("../../controllers/nftController")
const auth = require('../../middleware/auth');
var multer = require('multer');
// express --views=hbs 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage })

/**
 * @swagger
 * /api/v1/nft/addImage:
 *   post:
 *     tags:
 *       - NFT DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: Data is saved successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.post('/addImage', upload.single('file'), nftController.addImage);

/**
 * @swagger
 * /api/v1/nft/uploadNFT:
 *   post:
 *     tags:
 *       - NFT DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tokenId
 *         description: tokenId
 *         in: formData
 *         required: false
 *       - name: contractAddress
 *         description: contractAddress  ?? from collection
 *         in: formData
 *         required: false
 *       - name: tokenName
 *         description: tokenName
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *       - name: ipfsHash
 *         description: ipfsHash
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data is saved successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.post('/uploadNFT', upload.single('file'), nftController.uploadNFT);

/**
 * @swagger
 * /api/v1/nft/addNft:
 *   post:
 *     tags:
 *       - NFT DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ? in header
 *         in: header
 *         required: true
 *       - name: tokenId
 *         description: tokenId
 *         in: formData
 *         required: true
 *       - name: tokenName
 *         description: tokenName
 *         in: formData
 *         required: false
 *       - name: thumbNails
 *         description: thumbNails
 *         in: formData
 *         required: false
 *       - name: uri 
 *         description: uri i.e filehash
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Data is saved successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.post('/addNft', auth.verifyToken, upload.single('file'), nftController.addNft); //done

/**
 * @swagger
 * /api/v1/nft/viewNft/{_id}:
 *   get:
 *     tags:
 *       - NFT DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ? in header
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id ? in path
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.get('/viewNft/:_id', auth.verifyToken, nftController.viewNft); //done

/**
 * @swagger
 * /api/v1/nft/listNft:
 *   get:
 *     tags:
 *       - NFT DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ? in header
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.get('/listNft', auth.verifyToken, nftController.listNft); //done

/**
* @swagger
* /api/v1/nft/placeOrder:
*   post:
*     tags:
*       - PLACEORDER DASHBOARD
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ? in header
*         in: header
*         required: true
*       - name: nftId
*         description: nftId ?? _id
*         in: formData
*         required: true
*       - name: description
*         description: description
*         in: formData
*         required: true
*       - name: currentOwner
*         description: currentOwner
*         in: formData
*         required: false
*       - name: price
*         description: price
*         in: formData
*         required: false
*       - name: expiryTime
*         description: expiryTime
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Order has been placed successfully.
*       404:
*         description: This user does not exist.
*       500:
*         description: Internal Server Error
*/
router.post('/placeOrder', auth.verifyToken, nftController.placeOrder);

/**
* @swagger
* /api/v1/nft/updateOrder:
*   put:
*     tags:
*       - PLACEORDER DASHBOARD
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ? in header
*         in: header
*         required: true
*       - name: orderId
*         description: orderId ?? _id
*         in: formData
*         required: true
*       - name: description
*         description: description
*         in: formData
*         required: true
*       - name: currentOwner
*         description: currentOwner
*         in: formData
*         required: false
*       - name: price
*         description: price
*         in: formData
*         required: false
*       - name: expiryTime
*         description: expiryTime
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Order has been placed successfully.
*       404:
*         description: This user does not exist.
*       500:
*         description: Internal Server Error
*/
router.put('/updateOrder', auth.verifyToken, nftController.updateOrder);

/**
 * @swagger
 * /api/v1/nft/placeOrderList:
 *   get:
 *     tags:
 *       - PLACEORDER DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.get('/placeOrderList', nftController.placeOrderList);
/**
 * @swagger
 * /api/v1/nft/placeOrderListById/{_id}:
 *   get:
 *     tags:
 *       - PLACEORDER DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id ? in path
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.get('/placeOrderListById/:_id', nftController.placeOrderListById);

/**
 * @swagger
 * /api/v1/nft/orderListParticular:
 *   get:
 *     tags:
 *       - NFT DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ? in header
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
 router.get('/orderListParticular', auth.verifyToken, nftController.orderListParticular);

/**
* @swagger
* /api/v1/nft/nftWithoutOrderList:
*   get:
*     tags:
*       - PLACEORDER DASHBOARD
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Requested data found.
*       404:
*         description: This user does not exist.
*       500:
*         description: Internal Server Error
*/
router.get('/nftWithoutOrderList', auth.verifyToken, nftController.nftWithoutOrderList);

/**
* @swagger
* /api/v1/nft/sellOrder:
*   post:
*     tags:
*       - PLACEORDER DASHBOARD
*     description: Creating documents for selling order.
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ? in header
*         in: header
*         required: true
*       - name: orderId
*         description: orderId i.e _id
*         in: formData
*         required: true
*       - name: currentOwner
*         description: currentOwner
*         in: formData
*         required: true
*       - name: price
*         description: price
*         in: formData
*         required: true
*       - name: description
*         description: description
*         in: formData
*         required: false
*       - name: royalties
*         description: royalties
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Order has been sell successfully.   
*       404:
*         description: This user does not exist.
*       500:
*         description: Internal Server Error
*/
router.post('/sellOrder', auth.verifyToken, nftController.sellOrder);

/**
 * @swagger
 * /api/v1/nft/placeBid:
 *   post:
 *     tags:
 *       - BID DASHBOARD
 *     description: CREATING DOCUMENT FOR PLACE BID FOR NFT 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ? in header
 *         in: header
 *         required: true
 *       - name: orderId
 *         description:  orderId ?? _id
 *         in: formData
 *         required: true
 *       - name: price
 *         description: price
 *         in: formData
 *         required: true    
 *       - name: expireTime
 *         description: expireTime
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Bid has been placed successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.post('/placeBid', auth.verifyToken, nftController.placeBid)

/**
 * @swagger
 * /api/v1/nft/cancelBid:
 *   post:
 *     tags:
 *       - BID DASHBOARD
 *     description: CREATING DOCUMENT FOR cancel BID FOR NFT 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ? in header
 *         in: header
 *         required: true
 *       - name: _id
 *         description:  bidId ?? _id
 *         in: formData
 *         required: true    
 *     responses:
 *       200:
 *         description: Bid has been canceld successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
 router.post('/cancelBid', auth.verifyToken, nftController.cancelBid)



/**
 * @swagger
 * /api/v1/nft/bidList:
 *   get:
 *     tags:
 *       - BID DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */
router.get('/bidList', nftController.bidList);

/**
* @swagger
* /api/v1/nft/acceptBid:
*   put:
*     tags:
*       - BID DASHBOARD
*     description: Creating documents for accecpt order.
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ? in header
*         in: header
*         required: true
 *       - name: bidId
 *         description:  bidId ?? _id
 *         in: formData
 *         required: true 
*     responses:
*       200:
*         description: Bid accepted by nft holder successfully.
*       404:
*         description: This user does not exist.
*       500:
*         description: Internal Server Error
*/
router.put('/acceptBid', auth.verifyToken, nftController.acceptBid);


/**
* @swagger
* /api/v1/nft/rejectBid:
*   put:
*     tags:
*       - BID DASHBOARD
*     description: Creating documents for accecpt order.
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Bid rejected by nft holder successfully.
*       404:
*         description: This user does not exist.
*       500:
*         description: Internal Server Error
*/
router.put('/rejectBid', auth.verifyToken, nftController.rejectBid);




router.post('/updateOrder', auth.verifyToken, nftController.updateOrder)


router.post('/receiveNft', auth.verifyToken, nftController.receiveNft)





module.exports = router;