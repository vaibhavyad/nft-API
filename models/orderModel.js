const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
var orderSchema = new schema(
    {
        userId: {
            type: schema.Types.ObjectId,
            ref: 'users'
        },
        nftId: {
            type: schema.Types.ObjectId,
            ref: 'nft'
        },
        bidId: [{
            type: schema.Types.ObjectId,
            ref: 'bid'
        }],
        tokenId: {
            type: String
        },
        transactionHash:{
            type: String
        },
        description: {
            type: String
        },
        royalties: {
            type: String
        },
        isPlace: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number
        },
        coupounAddress: {
            type: String
        },
        expiryTime: {
            type: String
        },
        currentOwner: {
            type: String
        },
        saleType: {
            type: String,
            enum: ["ONSALE", "OFFSALE"]
        },
        orderType: {
            type: String,
            enum: ["FIXED_PRICE", "TIMED_AUCTION", "BID", "NONE"]
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    },
    { timestamps: true }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("order", orderSchema);

