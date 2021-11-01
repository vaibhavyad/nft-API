const { config } = require('../config/config')
const { commonResponse: response } = require('../helper/commonResponseHandler')
const { ErrorMessage } = require('../helper/message')
const { ErrorCode } = require('../helper/statusCode')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')


module.exports={
    verifyToken: (req, res, next) => {
    if (req.headers.token) {
        jwt.verify(req.headers.token, 'marketPlace-developer', (err, result) => {
            //console.log("i am in token",result)
            if (err) {
                response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.INCORRECT_JWT);
            }
            else {
                userModel.findOne({ _id: result.id }, (error, result2) => {
                    if (error)
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    else if (!result2) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND)
                    }
                    else {
                        if (result2.status == "BLOCK") {
                            response(res, ErrorCode.FORBIDDEN, [], ErrorMessage.BLOCKED_BY_ADMIN);
                        }
                        else if (result2.status == "DELETE") {
                            response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.DELETED_BY_ADMIN);
                        }
                        else {
                      
                            req.userId=result.id
                            next();
                        }
                    }
                })
            }
        })
    } else {
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.NO_TOKEN)
    }

},
verifyTokenBySocket: (token) => {
    return new Promise((resolve,reject)=>{
        console.log("token", token)
        try{
            if (token) {
                jwt.verify(token, 'Ethereum', (err, result) => {
                    //console.log("i am in token",result)
                    if (err) {
                        reject({ response_code:ErrorCode.UNAUTHORIZED, result:[], response_message:ErrorMessage.INCORRECT_JWT });

                    }
                    else {
                        userModel.findOne({ _id: result.id }, (error, result2) => {
                            if (error)
                            
                                reject({ response_code:ErrorCode.INTERNAL_ERROR, result:[], response_message:ErrorMessage.INTERNAL_ERROR });

                            else if (!result2) {
                                reject({ response_code:ErrorCode.NOT_FOUND, result:[], response_message:ErrorMessage.USER_NOT_FOUND });

                            }
                            else {
                                if (result2.status == "BLOCK") {
                                    
                                    reject({ response_code:ErrorCode.FORBIDDEN, result:[], response_message:ErrorMessage.BLOCKED_BY_ADMIN });

                                }
                                else if (result2.status == "DELETE") {
                                    
                                    reject({ response_code:ErrorCode.UNAUTHORIZED, result:[], response_message:ErrorMessage.DELETED_BY_ADMIN });

                                    
                                }
                                else {
                              
                                    // req.userId=result.id
                                    resolve(result2);
                                    
                                    // next();
                                }
        
        
                            }
                        })
                    }
                })
            } else {
                
                reject({ response_code:ErrorCode.BAD_REQUEST, result:[], response_message:ErrorMessage.NO_TOKEN});

                
            }
        }
        catch(e){
            
            reject({ response_code:ErrorCode.INTERNAL_ERROR, result:[], response_message:ErrorMessage.INTERNAL_ERROR});

        }
    })
   

},
}