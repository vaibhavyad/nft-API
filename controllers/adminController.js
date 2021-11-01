const userModel = require('../models/userModel');
const contactUsModel = require('../models/contactUsModel');
const bidModel = require('../models/bidModel');
const nftModel = require('../models/nftModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const bcrypt = require('bcryptjs');


module.exports = {


    /**
     * Function Name :login
     * Description   : login for admin
     *
     * @return response
    */
    login: async (req, res) => {
        try {
            userModel.findOne({ email: req.body.email, userType: { $in: ["SUBADMIN", "ADMIN"] } }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                }
                else {
                    const check = bcrypt.compareSync(req.body.password, userData.password)
                    if (check) {
                        var token = jwt.sign({ id: userData._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'marketPlace-developer', { expiresIn: '365d' });
                        let result = {
                            userId: userData._id,
                            token: token,
                            name: userData.name,
                            email: userData.email,
                            mobileNumber: userData.mobileNumber,
                            userType: userData.userType,
                            permissions: userData.permissions
                        };
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
                    }
                    else {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL)
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
     * Function Name :addAdmin
     * Description   : addAdmin for admin
     *
     * @return response
    */
    addAdmin: async (req, res) => {
        try {
            // const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["SUBADMIN", "ADMIN"] } })
            // if (!userData) {
            //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            // } else {
            const walletAddressCheck = await userModel.findOne({ walletAddress: req.body.walletAddress, status: "ACTIVE" });
            if (walletAddressCheck) {
                if (walletAddressCheck.userType == "USER") {
                    const changeAddress = await userModel.findByIdAndUpdate({ _id: walletAddressCheck._id }, { $set: { userType: "ADMIN" } }, { new: true });
                    if (changeAddress) {
                        response(res, SuccessCode.SUCCESS, changeAddress, SuccessMessage.UPDATE_SUCCESS);
                    }
                } else {
                    response(res, ErrorCode.ALREADY_EXIST, walletAddressCheck, ErrorMessage.WALLET_EXIST);
                }
            } else {
                const saved = await new userModel({
                    userType: "ADMIN",
                    walletAddress: req.body.walletAddress
                }).save();
                if (saved) {
                    response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
                }
            }
            // }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
      * Function Name :addUser
      * Description   : addUser for admin
      *
      * @return response
     */
    addUser: async (req, res) => {
        try {
            // const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["SUBADMIN", "ADMIN"] } })
            // if (!userData) {
            //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            // } else {
            const walletAddressCheck = await userModel.findOne({ walletAddress: req.body.walletAddress, status: "ACTIVE" });
            if (walletAddressCheck) {
                response(res, ErrorCode.ALREADY_EXIST, walletAddressCheck, ErrorMessage.WALLET_EXIST);
            } else {
                const saved = await new userModel({
                    userType: "USER",
                    walletAddress: req.body.walletAddress
                }).save();
                if (saved) {
                    response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
                }
            }
            // }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
      * Function Name : addContactUs
      * Description   : addContactUs for admin
      *
      * @return response
     */
    addContactUs: async (req, res) => {
        const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["SUBADMIN", "ADMIN"] } })
        if (!userData) {
            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
        } else {
            req.body.userId = userData._id;
            let saveResult = await new contactUsModel(req.body).save();
            if (saveResult) {
                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED);
            }
        }
    },

    listNft: async (req, res) => {
        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "ADMIN" });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                let nftResult = await nftModel.find({ userId: result._id, status: "ACTIVE" }).populate('userId');
                if (nftResult.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, nftResult, SuccessMessage.DATA_FOUND);
                }
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    bidList: async (req, res) => {
        try {
            // featuredAll()
            var orderRes = await bidModel.find({ status: "ACTIVE" }).populate('nftId');
            if (orderRes.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            } else {
                response(res, SuccessCode.SUCCESS, orderRes, SuccessMessage.DATA_FOUND)
            }
        } catch (error) {
            console.log("=204", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }

    },


    //*************************************************ends of exports****************************/
}