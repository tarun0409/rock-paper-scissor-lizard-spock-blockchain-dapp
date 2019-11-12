const express = require('express');
const router = express.Router();
ObjectId = require('mongodb').ObjectID;
Player = require('../../models/Player.model');

router.post('/',(req,res) => {
    if(!req.body)
    {
        return res.status(400).json({msg:"Invalid format.", input:req.body});
    }
    var players = Array();
    var player = {};
    if(!req.body.Name)
    {
        return res.status(400).json({msg:"Fields to be inserted : Name", input:req.body});
    }
    if(!req.body.Public_Key)
    {
        return res.status(400).json({msg:"Fields to be inserted : Public_Key", input:req.body});
    }
    player.Name = req.body.Name;
    var playerObj = new Player(player);
    players.push(playerObj);
    Player.create(players).then((createdPlayers) => {
        successResponseObj = Object()
        successResponseObj.msg = "Player created successfully!"
        successResponseObj.data = createdPlayers;
        return res.status(201).json(successResponseObj);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({msg:"Problem with inserting players to the database"});
    });
});

module.exports = router;