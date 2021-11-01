var express = require('express');
var router = express.Router();
var webApi = require('../controllerS/nftController');
/* GET home page. */
router.post('/acceptedToken', webApi.acceptedToken);
router.post('/owner', webApi.owner);
router.post('/approve', webApi.approve);
router.post('/createOrder', webApi.createOrder);    // create Order approve
router.post('/updateOrder', webApi.updateOrder);
router.post('/cancelOrder', webApi.cancelOrder);
router.post('/safeExecuteOrder', webApi.safeExecuteOrder);
// router.post('/updateOrder', webApi.updateOrder);
// router.post('/safePlaceBid', webApi.safePlaceBid);
// router.post('/acceptBid', webApi.acceptBid);
// router.post('/cancelBid', webApi.cancelBid);
// router.post('/setPaused', webApi.setPaused);
// router.post('/renounceOwnership', webApi.renounceOwnership);
// router.post('/onERC721Received', webApi.onERC721Received);
// router.post('/setOwnerCutPerMillion', webApi.setOwnerCutPerMillion);
// router.post('/transferOwnership', webApi.transferOwnership);
// router.post('/INTERFACE_ID_ERC721', webApi.INTERFACE_ID_ERC721);
// router.post('/cutPerMillion', webApi.cutPerMillion);
// router.post('/maxCutPerMillion', webApi.maxCutPerMillion);
// router.post('/paused', webApi.paused);
// router.post('/orderByAssetId', webApi.orderByAssetId);
// router.post('/bidByOrderId', webApi.bidByOrderId);

module.exports = router;