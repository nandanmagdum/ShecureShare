const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    owner: {type: mongoose.Types.ObjectId, required: true, ref: 'users'},
    name: {type: String, required: true},
    description: {type: String, },
    content: {type: Buffer, required: true},
    filetype: {type: String, required: true},
    filePassword: {type: String, default: null},
    access: {type: [{
        email: {type: String, required: true},
        permission: {type: String, enum: ['view', 'download',  'edit',], default: 'view'}
    }], default: []}
});

const fileModel = mongoose.model('files', fileSchema);

module.exports = fileModel;