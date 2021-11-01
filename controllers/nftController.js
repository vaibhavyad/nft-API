const userModel = require('../models/userModel');
const nftModel = require('../models/nftModel');
const orderModel = require('../models/orderModel');
const collectionModel = require('../models/collectionModel');
const bidModel = require('../models/bidModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const jwt = require('jsonwebtoken');
const openMarketHelper = require('../openMarketFunction/openMarketHelper');
const fs = require('fs');
const { create } = require('ipfs-http-client');
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });


module.exports = {

    addImage: async (req, res) => {
        try {
            console.log("req======>>", req.file)
            const fileName = req.file.filename;
            const filePath = req.file.path;
            const fileHash = await addFile(fileName, filePath);
            await deleteFile(filePath);
            let tokenData = {
                image: "https://ipfs.io/ipfs/" + fileHash // hash
            }
            console.log("Line no 39====tokenId==>>", tokenData)
            let ipfsRes = await ipfsUpload(tokenData);
            console.log("33-======>>>", ipfsRes)
            response(res, SuccessCode.SUCCESS, { ipfsHash: ipfsRes, fileHash: fileHash, imageUrl: tokenData.image }, SuccessMessage.DETAIL_GET);
        } catch (e) {
            console.log("====36", e)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },

    uploadNFT: async (req, res) => {
        try {
            // console.log("req======>>", req.file)
            // let tokenId = req.body.contractAddress + req.body.tokenId;
            // const fileName = req.file.filename;
            // const filePath = req.file.path;
            // const fileHash = await addFile(fileName, filePath);
            // console.log("Result======27=====>>>", fileHash)
            // await deleteFile(filePath);
            let tokenData = {
                name: req.body.tokenName ? req.body.tokenName : "Test",
                description: req.body.description ? req.body.description : "Testing",
                // image: "https://ipfs.io/ipfs/" + fileHash // hash
            }
            console.log("Line no 39====tokenId==>>", tokenData)
            let ipfsRes = await ipfsUpload(tokenData);
            tokenData.ipfsHash = ipfsRes;
            console.log("78-======>>>", ipfsRes, tokenData)
            response(res, SuccessCode.SUCCESS, tokenData, SuccessMessage.DETAIL_GET);
        }
        catch (error) {
            console.log("Error==>>", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    addNft: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                const addressCheck = await nftModel.findOne({ tokenId: req.body.tokenId, status: "ACTIVE" });
                const createFunction = await openMarketHelper.create(req.body.uri, req.body.tokenName)
                if (createFunction) {
                    console.log("====75", createFunction.transactionHash)
                    req.body.transactionHash = createFunction.transactionHash
                    if (addressCheck) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.WALLET_EXIST);
                    } else {
                        req.body.thumbNails = await commonFunction.uploadImage(req.body.thumbNails)
                        req.body.userId = userData._id;

                        const saved = await new nftModel(req.body).save();
                        if (saved) {
                            response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("Error==>>", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    viewNft: async (req, res) => {
        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                let nftResult = await nftModel.findOne({ _id: req.params._id, userId: result._id, status: "ACTIVE" });
                if (!nftResult) {
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

    listNft: async (req, res) => {
        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                let nftResult = await nftModel.find({ userId: result._id, status: "ACTIVE" }).populate('userId').sort({ createdAt: -1 });
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

    placeOrder: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {

                let nftData = await nftModel.findOne({ userId: userData._id });
                let openMarketResult = await openMarketHelper.nftApprove(nftData.tokenId);
                if (openMarketResult) {
                    console.log('openMarketResult >>>>>>>>>>>. ', openMarketResult)
                    let createOrderResult = await openMarketHelper.createOrder(nftData.tokenId, req.body.price, req.body.expiryTime);
                    if (createOrderResult) {
                        req.body.transactionHash = createOrderResult.transactionHash;
                        const nftCheck = await nftModel.findOne({ _id: req.body.nftId, status: "ACTIVE" });
                        if (!nftCheck) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            req.body.userId = userData._id;
                            req.body.nftId = nftCheck._id;
                            const saved = await new orderModel(req.body).save();
                            if (saved) {
                                await nftModel.findByIdAndUpdate({ _id: nftCheck._id }, { $set: { isPlace: true } }, { new: true });
                                response(res, SuccessCode.SUCCESS, saved, SuccessMessage.ORDER_PLACED);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("--461---", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    cancelOrder: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            }
            else {
                let find = await orderModel.findByIdAndUpdate({ _id: req.query._id }, { $set: { status: "DELETE" } }, { new: true })
                if (!find) {
                    response(res, ErrorCode.NOT_FOUND, [], "Order not found.")
                }
                else {
                    response(res, SuccessCode.SUCCESS, find, "Your order is cancelled successfully.")
                }
            }
        } catch (error) {
            console.log(error);
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    updateOrder: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            }
            else {
                let orderData = await orderModel.findOne({ _id: req.body.orderId, status: "ACTIVE" })
                if (!orderData) {
                    response(res, ErrorCode.NOT_FOUND, [], "Order not found.")
                }
                else {
                    let nftData = await nftModel.findOne({ _id: orderData.nftId });
                    let updateOrder = await openMarketHelper.updateOrder(nftData.tokenId, req.body.price, req.body.expiryTime);
                    if (updateOrder) {
                        req.body.transactionHash = updateOrder.transactionHash;
                        console.log(">>>>>>>>>>>>>>>>>>>>", updateOrder)
                        var orderRes = await orderModel.findByIdAndUpdate({ _id: orderData._id }, { $set: req.body }, { new: true, upsert: true })
                        response(res, SuccessCode.SUCCESS, orderRes, SuccessMessage.UPDATE_SUCCESS)
                    }

                }
            }
        } catch (error) {
            console.log(error);
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    sellOrder: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                let orderData = await orderModel.findOne({ userId: userData._id });
                let nftData = await nftModel.findOne({ _id: orderData.nftId });
                let ercApproveResult = await openMarketHelper.ercApprove(orderData.price) //
                if (ercApproveResult) {
                    console.log("ercApproveResult >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", ercApproveResult)
                    let safeExecuteOrderResult = await openMarketHelper.safeExecuteOrder(nftData.tokenId, req.body.price)
                    if (safeExecuteOrderResult) {
                        console.log("safeExecuteOrderResult >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", safeExecuteOrderResult)
                        req.body.transactionHash = safeExecuteOrderResult.transactionHash;
                        const nftCheck = await orderModel.findOne({ _id: req.body.orderId, status: "ACTIVE" }); //change body-params
                        if (!nftCheck) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            req.body.userId = userData._id;
                            req.body.nftId = nftCheck.nftId;
                            req.body.orderId = nftCheck._id;
                            const saved = await new orderModel(req.body).save();
                            if (saved) {
                                const updateRes = await nftModel.findOneAndUpdate({ nftId: nftCheck.nftId }, { $set: req.body })
                                response(res, SuccessCode.SUCCESS, saved, SuccessMessage.ORDER_PLACED);
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log("===356", e)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    placeOrderList: async (req, res) => {
        try {
            // featuredAll()

            var orderRes = await orderModel.find({ status: "ACTIVE" }).populate('nftId bidId').sort({ createdAt: -1 });
            if (orderRes.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            } else {
                response(res, SuccessCode.SUCCESS, orderRes, SuccessMessage.DATA_FOUND)
            }
        } catch (error) {
            console.log("=166", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },

    placeOrderListById: async (req, res) => {
        try {
            var orderRes = await orderModel.findOne({ _id: req.params._id, status: "ACTIVE" }).populate('userId nftId').sort({ createdAt: -1 });
            if (!orderRes) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            } else {
                response(res, SuccessCode.SUCCESS, orderRes, SuccessMessage.DATA_FOUND)
            }

        } catch (error) {
            console.log("=456", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    orderListParticular: async (req, res) => {

        try {
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" } });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                let orderResult = await orderModel.find({ userId: result._id, status: "ACTIVE" }).populate('userId nftId bidId').sort({ createdAt: -1 });;
                if (orderResult.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, orderResult, SuccessMessage.DATA_FOUND);
                }
            }
        }
        catch (error) {
            console.log("==142", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    nftWithoutOrderList: async (req, res) => {
        try {
            // featuredAll()
            let result = await userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" } });
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var orderRes = await nftModel.find({ userId: result._id, isPlace: false, status: "ACTIVE" }).populate('userId').sort({ createdAt: -1 });
                if (orderRes.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                } else {
                    response(res, SuccessCode.SUCCESS, orderRes, SuccessMessage.DATA_FOUND)
                }
            }

        } catch (error) {
            console.log("=219", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    // sellOrder: async (req, res) => {
    //     try {
    //         const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
    //         if (!userData) {
    //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
    //         } else {
    //             const nftCheck = await nftModel.findOne({ tokenId: req.body.tokenId, status: "ACTIVE" });
    //             if (!nftCheck) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
    //             } else {
    //                 req.body.userId = userData._id;
    //                 req.body.nftId = nftCheck._id;
    //                 const saved = await new orderModel(req.body).save();
    //                 if (saved) {
    //                     const updateRes = await nftModel.findOneAndUpdate({ tokenId: nftCheck.tokenId }, { $set: req.body })
    //                     response(res, SuccessCode.SUCCESS, saved, SuccessMessage.ORDER_PLACED);
    //                 }
    //             }
    //         }
    //     }
    //     catch (e) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    //     }
    // },



    ////////////////////////////////////////////////********************* */

    placeBid: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                const orderCheck = await orderModel.findOne({ _id: req.body.orderId, status: "ACTIVE" });
                if (!orderCheck) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    let nftData = await nftModel.findOne({ _id: orderCheck.nftId });
                    let ercApproveResult = await openMarketHelper.ercApprove(req.body.price) //
                    if (ercApproveResult) {
                        console.log("ercApproveResult +_+++++++++===============>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", ercApproveResult)
                        let safePlaceBid = await openMarketHelper.safePlaceBid(nftData.tokenId, req.body.price, req.body.expireTime, userData.privateKey);
                        console.log("======376", safePlaceBid.transactionHash)
                        if (safePlaceBid) {
                            req.body.transactionHash = safePlaceBid.transactionHash;
                            req.body.userId = userData._id;
                            req.body.nftId = orderCheck.nftId;
                            const saved = await new bidModel(req.body).save();
                            if (saved) {
                                await orderModel.findByIdAndUpdate({ _id: orderCheck._id }, { $push: { bidId: saved._id } }, { new: true });
                                response(res, SuccessCode.SUCCESS, saved, SuccessMessage.BID_PLACED);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("===Something went wrong line no 282", error);
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    cancelBid: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                const bidCheck = await bidModel.findOne({ _id: req.body.bidId, status: "ACTIVE" });
                if (!bidCheck) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    let nftData = await nftModel.findOne({ _id: bidCheck.nftId });
                    let cancelBid = await openMarketHelper.cancelBid(nftData.tokenId);
                    if (cancelBid) {
                        req.body.transactionHash = cancelBid.transactionHash;
                        req.body.userId = userData._id;
                        req.body.nftId = bidCheck.nftId;
                        let updateBid = await bidModel.findByIdAndUpdate({ _id: bidCheck._id }, { $set: { bidStatus: "CANCELED" } }, { new: true });
                        if (updateBid) {
                            await orderModel.findByIdAndUpdate({ _id: bidCheck.nftId }, { $pull: { bidId: updateBid._id } }, { new: true });
                            response(res, SuccessCode.SUCCESS, updateBid, SuccessMessage.BID_CANCELED);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log("===Something went wrong line no 282", error);
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    bidList: async (req, res) => {
        try {
            var orderRes = await bidModel.find({ status: "ACTIVE" }).populate('nftId').sort({ createdAt: -1 });
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

    acceptBid: async (req, res) => {
        try {
            let user = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!user) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                var bidCheck = await bidModel.findOne({ _id: req.body.bidId, status: "ACTIVE" });
                console.log("=====bifdRes", bidCheck)
                if (!bidCheck) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                } else {
                    let nftData = await nftModel.findOne({ _id: bidCheck.nftId });
                    console.log("====454=====", nftData)
                    let acceptBid = await openMarketHelper.acceptBid(nftData.tokenId, bidCheck.price);
                    console.log("=====455+++++++++++++++++", acceptBid)
                    if (acceptBid) {
                        req.body.transactionHash = acceptBid.transactionHash;
                        req.body.userId = user._id;
                        req.body.nftId = bidCheck.nftId;
                        let updateBid = await bidModel.findByIdAndUpdate({ _id: bidCheck._id }, { $set: { bidStatus: "ACCEPTED" } }, { new: true });
                        if (updateBid) {
                            await orderModel.findByIdAndUpdate({ _id: bidCheck.nftId }, { $push: { bidId: updateBid._id } }, { new: true });
                            response(res, SuccessCode.SUCCESS, updateBid, SuccessMessage.ACCEPTED_BID);
                        }
                    }
                }
            }

        } catch (error) {
            console.log(error);
            response(res, ErrorCode.WENT_WRONG, error, ErrorMessage.SOMETHING_WRONG)
        }

    },

    rejectBid: async (req, res) => {
        try {
            let user = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!user) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            }
            else {
                let bidCheck = await bidModel.findOne({ nftId: user._id }).sort({ createdAt: -1 })
                if (!bidCheck) {
                    response(res, ErrorCode.NOT_FOUND, [], "Bid not found.")
                }
                else {
                    bidModel.findOneAndUpdate({ _id: bidCheck._id }, { $set: { bidStatus: "REJECTED" } }, { new: true })
                        .then(update => {
                            req.body.userId = bidCheck.userId;
                            nftModel.findOneAndUpdate({ userId: bidCheck.nftId }, { $set: req.body }, { new: true })
                                .then(update1 => {
                                    response(res, SuccessCode.SUCCESS, update, "Bid Rejected by nft holder successfully.")
                                })
                                .catch(err => {
                                    response(res, ErrorCode.INTERNAL_ERROR, err, ErrorMessage.INTERNAL_ERROR)
                                })
                        })
                        .catch(err1 => {
                            response(res, ErrorCode.INTERNAL_ERROR, err1, ErrorMessage.INTERNAL_ERROR)
                        })
                }
            }
        } catch (error) {
            console.log(error);
            response(res, ErrorCode.WENT_WRONG, error, ErrorMessage.SOMETHING_WRONG)
        }
    },

    receiveNft: async (req, res) => {
        try {
            const userData = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
            if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
            } else {
                let check = await nftModel.findOne({ _id: req.query._id, transferStatus: "PENDING" })
                if (!check) {
                    response(res, ErrorCode.NOT_FOUND, [], "NFT not found.")
                }
                else {
                    nftModel.findByIdAndUpdate({ _id: check._id }, { $set: { transferStatus: "RECEIVED" } }, { new: true }).then(result => {
                        response(res, SuccessCode.SUCCESS, result, "NFT received successfully by user.")
                    }).catch(error => {
                        response(res, ErrorCode.INTERNAL_ERROR, error, ErrorMessage.INTERNAL_ERROR)
                    })
                }
            }
        } catch (error) {
            console.log(error);
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    }

    //*************************************ends of exports******************************************/
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

const ipfsUpload = async (tokenId, tokenData) => {
    try {
        const { cid } = await ipfs.add({ path: tokenId, content: JSON.stringify(tokenData) }, { cidVersion: 1, hashAlg: 'sha2-256' });
        console.log('cid', cid.toString());
        return cid.toString()
    } catch (error) {
        console.log('error', error);
    }
}

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({ path: fileName, content: file }, { cidVersion: 1, hashAlg: 'sha2-256' });
    console.log("193======>>>", fileAdded)
    const fileHash = fileAdded.cid.toString();
    console.log("Line no 167=======>>>", fileHash)
    return fileHash;
}

const deleteFile = async (filePath) => {
    fs.unlink(filePath, (deleteErr) => {
        if (deleteErr) {
            console.log("Error: failed to delete the file", deleteErr);
        }
    })
}


// async mintNft = (req, res, next) =>{
//     try {
//         var allReceipt = [];
//         var i, j, temporary, chunk = 50;
//         for (i = 0, j = rawData.length; i < j; i += chunk) {
//             temporary = rawData.slice(i, i + chunk);
//             var address = [];
//             // temporary.sort(index => address.push(index.sendAddress));
//             for (let k = 0; k < temporary.length; k++) {
//                 // let addr = rawData[i].sendAddress
//                 address.push(rawData[i].sendAddress);
//             }
//             console.log("address===>>", address, i, j, temporary.length, address.length)
//             // const txObject = {
//             //     to: mintDataStore,
//             //     gasPrice: web3.utils.toHex('4000000000000'),    // Always in Wei
//             //     gasLimit: web3.utils.toHex('13286640'),
//             //     // value: price.toString(),
//             //     data: contract.methods.reservePUNKS(address.length, address).encodeABI()
//             // };
//             // console.log("txObject===>>", txObject)
//             // const signPromise = await web3.eth.accounts.signTransaction(txObject, adminPrivateKey);
//             // console.log("signPromise===>>>", signPromise);
//             // const receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction);
//             // console.log('receipt===>>>', receipt);
//             // allReceipt.push(receipt.transactionHash)

//             if (i == 3665) {
//                 return res.status(200).json(new response(allReceipt, responseMessage.METADATA_UPLOADED));
//             }
//         }


//         // for (let i = 0; i < 50; i++) {
//         //     // let addr = rawData[i].sendAddress
//         //     address.push("0xE65F6552cf4D370499A663Cc91Ecd1a5C39D291D")
//         // }
//         // console.log("address==>>", address, address.length)
//         // // var address = ["0xE65F6552cf4D370499A663Cc91Ecd1a5C39D291D"]

//     }
//     catch (error) {
//         console.log("Error==>>", error)
//         return next(error);
//     }
// },

// async mintNftSecond(req, res, next) {
//     try {
//         var allReceipt = [];
//         var i, j, temporary, chunk = 50;
//         for (i = 0, j = 300; i < j; i += chunk) {
//             temporary = rawData.slice(i, i + chunk);
//             var address = [];
//             // temporary.sort(index => address.push(index.sendAddress));
//             for (let k = 0; k < temporary.length; k++) {
//                 // let addr = rawData[i].sendAddress
//                 address.push("Testing address");
//             }
//             console.log("address===>>", address, i, j, temporary.length, address.length)
//             // const txObject = {
//             //     to: mintDataStore,
//             //     gasPrice: web3.utils.toHex('4000000000000'),    // Always in Wei
//             //     gasLimit: web3.utils.toHex('13286640'),
//             //     // value: price.toString(),
//             //     data: contract.methods.reservePUNKS(address.length, address).encodeABI()
//             // };
//             // console.log("txObject===>>", txObject)
//             // const signPromise = await web3.eth.accounts.signTransaction(txObject, adminPrivateKey);
//             // console.log("signPromise===>>>", signPromise);
//             // const receipt = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction);
//             // console.log('receipt===>>>', receipt);
//             // allReceipt.push(receipt.transactionHash)

//             if (i == 3665) {
//                 return res.status(200).json(new response(allReceipt, responseMessage.METADATA_UPLOADED));
//             }
//         }


//         // for (let i = 0; i < 50; i++) {
//         //     // let addr = rawData[i].sendAddress
//         //     address.push("0xE65F6552cf4D370499A663Cc91Ecd1a5C39D291D")
//         // }
//         // console.log("address==>>", address, address.length)
//         // // var address = ["0xE65F6552cf4D370499A663Cc91Ecd1a5C39D291D"]

//     }
//     catch (error) {
//         console.log("Error==>>", error)
//         return next(error);
//     }
// }








 // acceptBid: async (req, res) => {
    //     try {
    //         let user = await userModel.findOne({ _id: req.userId, userType: { $in: ["USER"] } })
    //         if (!user) {
    //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
    //         }
    //         else {
    //             const bidCheck = await bidModel.findOne({ _id: req.body.bidId, status: "ACTIVE" });
    //             if (!bidCheck) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
    //             let bidCheck = await bidModel.findOne({ nftId: user._id }).sort({ createdAt: -1 })
    //             if (!bidCheck) {
    //                 response(res, ErrorCode.NOT_FOUND, [], "Bid not found.")
    //             }
    //             else {
                    // var update = await bidModel.findOneAndUpdate({}, { $set: { bidStatus: "ACCEPTED" } }, { new: true })
                    // req.body.userId = bidCheck.userId;
    //                 var update1 = await nftModel.findOneAndUpdate({ userId: bidCheck.nftId }, { $set: req.body }, { new: true })
    //                 response(res, SuccessCode.SUCCESS, update, "Bid accepted by nft holder successfully.")
    //             }
    //         }
    //     }
    //     } catch (error) {
    //         console.log(error);
    //         response(res, ErrorCode.WENT_WRONG, error, ErrorMessage.SOMETHING_WRONG)
    //     }
    // },