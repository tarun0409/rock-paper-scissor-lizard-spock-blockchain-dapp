var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    Name:String,
    Player_One: Schema.Types.ObjectId,
    Player_Two: Schema.Types.ObjectId,
    Players_Joined: Number,
    Rounds_Finished:Number,
    Maximum_Rounds: Number,
    Player_One_Score: Number,
    Player_Two_Score: Number,
    Player_One_Choice: String,
    Player_Two_Choice: String,
    Winner: Schema.Types.ObjectId
});

module.exports = mongoose.model('Game', GameSchema);