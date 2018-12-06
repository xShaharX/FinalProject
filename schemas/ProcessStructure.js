const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processStructure = new Schema({
    structure_name: String,
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        condition: {type: String, enum: ['And', 'Or']},
        nextStages: [Number],
        stagesToWaitFor: [Number],
        online_forms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
        attached_files: [{type: Schema.Types.ObjectId, ref:'File'}],
    }],
});

this.processStructure = mongoose.model('ProcessStructure', processStructure);