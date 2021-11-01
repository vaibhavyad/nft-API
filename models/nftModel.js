const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
var nftSchema = new schema(
    {
        userId: {
            type: schema.Types.ObjectId,
            ref: 'users'
        },
        collectionId: {
            type: schema.Types.ObjectId,
            ref: 'collection'
        },
        transactionHash:{
            type: String
        },
        nftAddress:{
            type: String
        },
        creatorAddress:{
            type: String
        },
        ipfsDataLink:{
            type:String
        },
        thumbNails:{
            type: String
        },
        contractAddress: {
            type: String
        },
        tokenId: {
            type: String
        },
        tokenName: {
            type: String
        },
        isPlace:{
            type:Boolean,
             default: false
        },
        thumbNail:{
            type: String
        },

        uri: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        file: {
            type: String
        },
        ipfsHash: {
            type: String
        },
        fileHash: {
            type: String
        },
        fileName:{
            type: String
        },
        transferStatus: {
            type: String,
            enum: ["PENDING", "RECEIVED"],
            default: "PENDING"
        },
        status: {
            type: String,
            enum: ["ACTIVE", "BLOCK", "DELETE"],
            default: "ACTIVE"
        },
    },
    { timestamps: true }
);

nftSchema.plugin(mongoosePaginate);
nftSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("nft", nftSchema);

