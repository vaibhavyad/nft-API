const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
var bidSchema = new schema(
    {
        userId: {
            type: schema.Types.ObjectId,
            ref: 'users'
        },
        nftId:{
            type: schema.Types.ObjectId,
            ref: 'nft'
        },
        transactionHash:{
            type:String
        },
        tokenId:
        {
            type: String,
        },
        amount:
        {
            type: String,
        },
        currentOwner: {
            type: String
        },
        price:{
            type: String
        },
        
        expireTime:
        {
            type: String,
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
        bidStatus: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED","CANCELED"],
            default: "PENDING"
        },
    },
    { timestamps: true }
);
bidSchema.plugin(mongoosePaginate);
bidSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("bid", bidSchema);

