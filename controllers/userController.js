const userModel = require('../models/userModel');
const collectionModel = require('../models/collectionModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const multiparty = require('multiparty');
const password = 'bafkreiazkoqwn4sxar7f4f66ic6zuneqgpvh2ym4cwxetc7mk4dyyym55e';

const crypto = require("crypto");
const hash = crypto.createHash('sha256');



module.exports = {

    connectWallet: async (req, res) => {
        try {
            const walletCheck = await userModel.findOne({ walletAddress: req.body.walletAddress, privateKey: req.body.privateKey, status: "ACTIVE" });
            console.log("====walletCheck", walletCheck)
            const privateKey = encrypt(req.body.privateKey, password)
            if (walletCheck) {
                var token = jwt.sign({ id: walletCheck._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'marketPlace-developer', { expiresIn: '365d' });
                let result = {
                    userId: walletCheck._id,
                    token: token,
                    walletAddress: walletCheck.walletAddress,
                    userType: walletCheck.userType,
                    privateKey: privateKey,
                };
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_SAVED)
            } else {
                const saveRes = await new userModel(req.body).save();
                if (saveRes) {
                    var token1 = jwt.sign({ id: saveRes._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'marketPlace-developer', { expiresIn: '365d' });
                    let result1 = {
                        userId: saveRes._id,
                        token: token1,
                        walletAddress: saveRes.walletAddress,
                        userType: saveRes.userType,
                        privateKey: privateKey,
                    };
                    response(res, SuccessCode.SUCCESS, result1, SuccessMessage.DATA_SAVED);
                }
            }
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    getProfile: async (req, res) => {
        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    editProfile: async (req, res) => {
        try {
            let admin = await userModel.findOne({ _id: req.userId, userType: "USER", status: { $ne: "DELETE" } });
            if (!admin) {
                response(res, ErrorCode.INVALID_CREDENTIALS, [], ErrorMessage.INVALID_CREDENTIAL);
            }
            else {
                if (req.file) {
                    req.body.profilePic = await commonFunction.uploadProfileImage(req.file.path);
                }
                userModel.findByIdAndUpdate({ _id: admin._id }, { $set: req.body }, { new: true })
                    .then(result => {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.PROFILE_DETAILS);
                    })
                    .catch(err => {
                        response(res, ErrorCode.INTERNAL_ERROR, err, ErrorMessage.INTERNAL_ERROR);
                    })
            }

        } catch (error) {
            console.log("error", error)
            response(res, ErrorCode.WENT_WRONG, error, ErrorMessage.SOMETHING_WRONG);
        }
    },
    createCollection: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                var form = new multiparty.Form();
                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], "Unsupported format")
                    } else {
                        const addressCheck = await collectionModel.findOne({ contractAddress: fields.contractAddress[0], status: "ACTIVE" });
                        if (addressCheck) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.WALLET_EXIST);
                        } else {
                            let obj = {}
                            if (files.image.length > 0) {
                                var imgArray = files.image.map((item) => (item.path));
                                imgArray = await commonFunction.multipleImageUploadCloudinaryWithPromise(imgArray.filter(Boolean));
                                obj.image = imgArray;
                            }
                            obj.userId = userData._id;
                            obj.contractAddress = fields.contractAddress[0];
                            obj.name = fields.name ? fields.name[0] : "";
                            obj.symbol = fields.symbol ? fields.symbol[0] : "";
                            obj.baseURI = fields.baseURI ? fields.baseURI[0] : "";
                            obj.description = fields.description ? fields.description[0] : "";
                            obj.categoryType = fields.categoryType ? fields.categoryType[0] : "";
                            const saved = await new collectionModel(obj).save();
                            if (saved) {
                                response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
                            }
                        }
                    }
                })

            }
        }
        catch (error) {
            console.log("error===>>", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    viewCollection: async (req, res) => {
        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                let collectionResult = await collectionModel.findOne({ _id: req.params._id, userId: result._id, status: "ACTIVE" });
                if (!collectionResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, collectionResult, SuccessMessage.DATA_FOUND);
                }
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    collectionList: async (req, res) => {
        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                let query = { $and: [{ status: "ACTIVE" }, { $or: [{ userId: result._id }, { collectionType: "DEFAULT" }] }] }
                let collectionResult = await collectionModel.find(query);
                if (collectionResult.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, collectionResult, SuccessMessage.DATA_FOUND);
                }
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    //**************************************ends of exports**********************************//
}



function convertImage(profilePic) {
    return new Promise((resolve, reject) => {
        commonFunction.uploadImage(profilePic, (error, imageData) => {
            if (error) {
                resolve(error)
            }
            else {
                resolve(imageData)
            }
        })
    })
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