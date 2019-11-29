var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    Name:String,
    Player_One: Schema.Types.ObjectId,
    Player_Two: Schema.Types.ObjectId,
    Players_Joined: Number,
    Winner: Schema.Types.ObjectId
});

module.exports = mongoose.model('Game', GameSchema);