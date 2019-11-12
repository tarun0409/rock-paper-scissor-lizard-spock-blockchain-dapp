var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    Name:String,
    Public_Key:String
});

module.exports = mongoose.model('Player', PlayerSchema);