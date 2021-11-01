const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const async = require('async')
cloudinary.config({
  cloud_name: "dxpgsnqbw",
  api_key: "549273191543456",
  api_secret: "eN8D-qIT_VlPrtuX-kRYCg8zVdw"
});
module.exports = {

  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },

  // uploadImage(img, callback) {
  //   cloudinary.v2.uploader.upload(img, {
  //     resource_type: "raw"
  //   }, (err, result) => {
  //     console.log("302===>>", err, result)
  //     if (err) {
  //       callback(err, null)
  //     }
  //     else {
  //       callback(null, result.secure_url)
  //     }
  //   });
  // },

  multipleImageUploadCloudinaryWithPromise: (imageB64) => {
    return new Promise((resolve, reject) => {
      let imageArr = []
      async.eachSeries(imageB64, (items, callbackNextiteration) => {
        module.exports.uploadImage(items, (err, url) => {
          if (err) {
            console.log("error is in line 119", err)
            reject("something went wrong")
          }
          else {
            imageArr.push(url);
            callbackNextiteration();
          }
        })
      }, (err) => {
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhh", imageArr)
        resolve(imageArr);
      }

      )
    })
  },
  uploadImage(thumbNails) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(thumbNails, function (result, error) {
        console.log("result", result, "error", error);
        if (error) {
          reject(error);
        }
        else {
          resolve(result.url)
        }
      });
    })
  },

  uploadProfileImage(profilePic) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(profilePic, function (result, error) {
        console.log("result", result, "error", error);
        if (error) {
          reject(error);
        }
        else {
          resolve(result.url)
        }
      });
    })
  },





}
