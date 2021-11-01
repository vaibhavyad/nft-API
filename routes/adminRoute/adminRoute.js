const router = require("express").Router();
// const cors = require('cors');
const adminController = require("../../controllers/adminController");
const auth = require('../../middleware/auth');
const { route } = require("../userRoute/userRoute");

// /**
//  * @swagger
//  * /api/v1/admin/login:
//  *   post:
//  *     tags:
//  *       - ADMIN DASHBOARD
//  *     description: Check for Social existence and give the access Token 
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: email
//  *         description: email
//  *         in: formData
//  *         required: true
//  *       - name: password
//  *         description: password
//  *         in: formData
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Your login is successful
//  *       404:
//  *         description: Invalid credentials
//  *       500:
//  *         description: Internal Server Error
//  */
router.post('/login', adminController.login);

// /**
//  * @swagger
//  * /api/v1/admin/addAdmin:
//  *   post:
//  *     tags:
//  *       - ADMIN DASHBOARD
//  *     description: Check for Social existence and give the access Token 
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: token
//  *         description: token ?? in header
//  *         in: header
//  *         required: false
//  *       - name: walletAddress
//  *         description: walletAddress
//  *         in: formData
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Data is saved successfully.
//  *       404:
//  *         description: Wallet address already exist!
//  *       500:
//  *         description: Internal Server Error
//  */
router.post('/addAdmin', adminController.addAdmin);


// /**
//  * @swagger
//  * /api/v1/admin/addUser:
//  *   post:
//  *     tags:
//  *       - ADMIN DASHBOARD
//  *     description: Check for Social existence and give the access Token 
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: token
//  *         description: token ?? in header
//  *         in: header
//  *         required: false
//  *       - name: walletAddress
//  *         description: walletAddress
//  *         in: formData
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Data is saved successfully.
//  *       404:
//  *         description: Wallet address already exist!
//  *       500:
//  *         description: Internal Server Error
//  */
router.post('/addUser', adminController.addUser);


// /**
//  * @swagger
//  * /api/v1/admin/addContactUs:
//  *   post:
//  *     tags:
//  *       - ADMIN DASHBOARD
//  *     description: Check for Social existence and give the access Token 
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: token
//  *         description: token ?? in header
//  *         in: header
//  *         required: false
//  *       - name: name
//  *         description: name
//  *         in: formData
//  *         required: false
//  *       - name: email
//  *         description: email
//  *         in: formData
//  *         required: false
//  *       - name: mobileNumber
//  *         description: mobileNumber
//  *         in: formData
//  *         required: false
//  *       - name: subject
//  *         description: subject
//  *         in: formData
//  *         required: false
//  *       - name: description
//  *         description: description
//  *         in: formData
//  *         required: false
//  *     responses:
//  *       200:
//  *         description: Data is saved successfully.
//  *       404:
//  *         description: Wallet address already exist!
//  *       500:
//  *         description: Internal Server Error
//  */
router.post('/addContactUs',auth.verifyToken, adminController.addContactUs);

/**
 * @swagger
 * /api/v1/nft/listNft:
 *   get:
 *     tags:
 *       - ADMIN
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
 router.get('/listNft', auth.verifyToken, adminController.listNft); //done
 
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
router.get('/bidList', adminController.bidList);



module.exports = router;