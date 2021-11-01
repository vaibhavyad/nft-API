const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var contactUs = new schema(
    {
        userId:{
            type:schema.Types.ObjectId,
            ref:"user"
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        mobileNumber: {
            type: String
        },
        subject: {
            type: String
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "DELETE", "BLOCK"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

contactUs.plugin(mongoosePaginate);
module.exports = mongoose.model("contactUs", contactUs);