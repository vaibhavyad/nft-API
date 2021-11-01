const router = require("express").Router();
const userController = require("../../controllers/userController")
const auth = require('../../middleware/auth');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/v1/user/connectWallet:
 *   post:
 *     tags:
 *       - USER DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: walletAddress
 *         description: walletAddress
 *         in: formData
 *         required: true  
 *       - name: privateKey
 *         description: privateKey
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
router.post('/connectWallet', userController.connectWallet); //done

/**
 * @swagger
 * /api/v1/user/getProfile:
 *   get:
 *     tags:
 *       - USER DASHBOARD
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
router.get('/getProfile', auth.verifyToken, userController.getProfile); //done


/**
 * @swagger
 * /api/v1/user/editProfile:
 *   put:
 *     tags:
 *      - USER DASHBOARD
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: userName
 *         description: userName
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: false
 *       - name: bio
 *         description: bio
 *         in: formData
 *         required: false
 *       - name: baseUri
 *         description: baseUri
 *         in: formData
 *         required: false
 *       - name: profilePic
 *         description: profilePic ?? base64
 *         in: formData
 *         type: file
 *     responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error
 */

 router.put('/editProfile', auth.verifyToken, upload.single('profilePic'), userController.editProfile);  //done

router.post('/createCollection', auth.verifyToken, userController.createCollection); 

router.get('/viewCollection/:_id', auth.verifyToken, userController.viewCollection);

router.get('/collectionList', auth.verifyToken, userController.collectionList); //done




 
module.exports = router;