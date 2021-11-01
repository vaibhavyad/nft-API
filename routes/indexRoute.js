const router = require("express").Router();
const user = require('./userRoute/userRoute');
const admin = require('./adminRoute/adminRoute');
const nft = require('./nftRoute/nftRoute');

router.use('/user', user);
router.use('/admin', admin);
router.use('/nft',nft);

module.exports = router;