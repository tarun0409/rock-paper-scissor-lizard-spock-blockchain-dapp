const express = require('express');
const router = express.Router();
ObjectId = require('mongodb').ObjectID;
Game = require('../../models/Game.model');

router.get('/',(req,res) => {
    Game.find().then((games) => {
        if(games.length === 0)
        {
            return res.status(204).json({admins:[]});
        }
        res.json({games});
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({msg:"Problem with fetching games from the database"});
    });
});

router.post('/',(req,res) => {
    if(!req.body)
    {
        return res.status(400).json({msg:"Invalid format.", input:req.body});
    }
    var games = Array();
    var game = {};
    if(!req.body.Name)
    {
        return res.status(400).json({msg:"Fields to be inserted : Name", input:req.body});
    }
    if(!req.body.Maximum_Rounds)
    {
        return res.status(400).json({msg:"Fields to be inserted : Maximum Rounds", input:req.body});
    }
    game.Name = req.body.Name;
    game.Players_Joined = 0;
    game.Rounds_Finished = 0;
    game.Maximum_Rounds = req.body.Maximum_Rounds;
    game.Player_One_Score = 0;
    game.Player_Two_Score = 0;
    var gameObj = new Game(game);
    games.push(gameObj);
    Game.create(games).then((createdGames) => {
        successResponseObj = Object()
        successResponseObj.msg = "Game created successfully!"
        successResponseObj.data = createdGames;
        return res.status(201).json(successResponseObj);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({msg:"Problem with inserting games to the database"});
    });
});

router.post('/:gameId/move',(req,res) => {
    if(!req.query.choice)
    {
        return res.status(400).json({msg:"Query fields to be inserted : choice", query:req.query});
    }
    if(!req.query.playerId)
    {
        return res.status(400).json({msg:"Query fields to be inserted : playerId", query:req.query});
    }
    var playerId = ObjectId(req.query.playerId);
    var gameId = ObjectId(req.params.gameId);
    var playerQuery = {};
    playerQuery._id = playerId;
    var gameQuery = {};
    gameQuery._id = gameId;
    Player.find(playerQuery).then((players) => {
        if(players.length === 0)
        {
            return res.status(400).json({msg:"Invalid player ID", input:req.params.playerId});
        }
        Game.find(gameQuery).then((games) => {
            if(games.length === 0)
            {
                return res.status(400).json({msg:"Invalid game ID", input:req.params.gameId});
            }
            if(!games[0].Player_One || !games[0].Player_Two)
            {
                return res.status(400).json({msg:"One or more players have not registered yet"});
            }
            var gameObj = {};
            if(String(playerId) === String(games[0].Player_One) && !game[0].Player_One_Choice)
            {
                gameObj.Player_One_Choice = req.query.choice;
            }
            else if(String(playerId) === String(games[0].Player_Two) && !game[0].Player_Two_Choice)
            {
                gameObj.Player_Two_Choice = req.query.choice;
            }
            var gameQuery = {};
            gameQuery._id = gameId;
            Game.updateOne(gameQuery,gameObj, (err) => {
                if(err)
                {
                    return res.status(500).json({msg:"Some problem occurred while updating game"});
                }
                return res.status(200).json({msg:"Choice updated successfully"});
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({msg:"Problem with fetching games from the database"});
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({msg:"Problem with fetching games from the database"});
    });
});

module.exports = router;