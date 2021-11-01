const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const bcrypt = require("bcryptjs");
const commonFunction = require('../helper/commonFunction');
const schema = mongoose.Schema;
var userModel = new schema(
  {
    email: {
      type: String
    },
    name: {
      type: String
    },
    userName: {
      type: String
    },
    mobileNumber: {
      type: String
    },
    bio:{
      type: String
    },
    baseUri:{
      type: String
    },
    password: {
      type: String
    },
    dateOfBirth: {
      type: String
    },
    walletAddress: {
      type: String
    },
    address: {
      type: String
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: ""
    },
    countryCode: {
      type: String
    },
    privateKey:{
      type: String
    }
    ,
    gender: {
      type: String,
      enum: ["Male", "Female", "Trans"]
    },
    profilePic: {
      type: String,
      default: ""
    },
    location: {
      type: String
    },
    ownedBy:{
       type: String,
    }, 
    soldNFT:{
      type: String
    }, 
    boughtNFT:{
      type: String
    }, 
     userType: {
      type: String,
      enum: ["ADMIN", "USER", "SUBADMIN"],
      default: "USER"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "DELETE"],
      default: "ACTIVE"
    },
  },
  { timestamps: true }
);

userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("users", userModel);

mongoose.model("users", userModel).find({ userType: "ADMIN" }, async (err, result) => {
  if (err) {
    console.log("DEFAULT ADMIN ERROR", err);
  }
  else if (result.length != 0) {
    console.log("Default Admin.");
  }
  else {
    let obj = {
      userType: "ADMIN",
      name: "Vipin Kumar",
      countryCode: "+91",
      mobileNumber: "7017446378",
      email: "no-vipin@mobiloitte.com",
      dateOfBirth: "26/06/1998",
      gender: "Male",
      password: bcrypt.hashSync("Mobiloitte1"),
      address: "Muzaffarnagar, UP, India",
      profilePic: "https://res.cloudinary.com/mobiloitte694/image/upload/v1632895904/cosmetics_10004_pkjzri.jpg"
    };
    mongoose.model("users", userModel).create(obj, async (err1, result1) => {
      if (err1) {
        console.log("DEFAULT ADMIN  creation ERROR", err1);
      } else {
        console.log("DEFAULT ADMIN Created", result1);
      }
    });
  }
});
