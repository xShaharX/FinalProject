let mongoose = require("mongoose");

const Schema = mongoose.Schema;

const waitingProcessStructuresSchema = new Schema({
    userEmail: String,
    structureName: String,
    addOrEdit: Boolean, // true for add
    date: Date,
    sankey: String,
    onlineForms: [{type: Schema.Types.ObjectId, ref: 'OnlineForm'}],
    automaticAdvanceTime: {type:String, enum:["0","24","48","72","96","120","144"]} // 0 means there's no automaticAdvanceTime
});

module.exports = mongoose.model('waitingProcessStructuresSchema', waitingProcessStructuresSchema);