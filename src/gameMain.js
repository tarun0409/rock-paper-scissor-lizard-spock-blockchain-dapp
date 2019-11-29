$(document).ready(function(){
    if(getCookie('playerId') == null || getCookie('playerId')=='null' || getCookie('playerId')==='null')
    {
        window.location.href='/login';
        return;
    }
    validateUrl = "/validateLogin/"+getCookie('playerId');
    $.ajax({
        type:"GET",
        url:validateUrl,
        success: function(response){
            $.ajax({
                type:"GET",
                url:"/game",
                success: function(response){
                    games = response.games;
                    if(games.length === 0)
                    {
                        var trElement = document.createElement("tr");
                        var gameNameTd = document.createElement("td");
                        gameNameTd.classList.add("text-center");
                        var gameNameText = document.createTextNode("No games available.");
                        gameNameTd.appendChild(gameNameText);
                        trElement.appendChild(gameNameTd);
                        document.getElementById("gameTable").appendChild(trElement);
                    }
                    for(var i=0; i<games.length; i++)
                    {
                        var trElement = document.createElement("tr");
                        var gameNameTd = document.createElement("td");
                        gameNameTd.classList.add("text-center");
                        var gameNameText = document.createTextNode(games[i].Name);
                        gameNameTd.appendChild(gameNameText);
                        trElement.appendChild(gameNameTd);
                        var playersJoinedTd = document.createElement("td");
                        playersJoinedTd.classList.add("text-center");
                        var playersJoinedText = document.createTextNode(games[i].Players_Joined);
                        playersJoinedTd.appendChild(playersJoinedText);
                        trElement.appendChild(playersJoinedTd);
                        var winnerTd = document.createElement("td");
                        winnerTd.classList.add("text-center");
                        if(games[i].Winner)
                        {
                            var winnerText = document.createTextNode(games[i].Winner);
                            winnerTd.appendChild(winnerText);
                        }
                        else
                        {
                            var winnerText = document.createTextNode(" ");
                            winnerTd.appendChild(winnerText);
                        }
                        trElement.appendChild(winnerTd);
                        var joinTd = document.createElement("td");
                        var joinButton = document.createElement('button');
                        joinButton.setAttribute('type','button');
                        joinButton.setAttribute('gameId',games[i].id);
                        joinButton.classList.add('joinButton');
                        joinButton.classList.add('btn');
                        joinButton.classList.add('btn-success');
                        var joinText = document.createTextNode("Join");
                        joinButton.appendChild(joinText);
                        joinTd.appendChild(joinButton);
                        trElement.appendChild(joinTd);
                        document.getElementById("gameTable").appendChild(trElement);
                    }
                },
                error: function(response) {
                    console.log(response.responseText);
                }
            });
            
        },
        error: function(response) {
            window.location.href='/login';
        }
    });
    
    $("#createGame").click(function(){
        var gameName = $('#gameName').val();
        var playerValue = $("input[name='player']:checked").val();
        var randomAgent = playerValue === "random";
        gameObj = {};
        gameObj["Name"] = gameName;
        $.ajax({
            type: "POST",
            url: "/game",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(gameObj),
            success: function(response) {
                
                web3.eth.getCoinbase(function(err,res){
                    var fromObj = {};
                    fromObj.from = res;
                    if(randomAgent)
                    {
                        fromObj.value = 100000000000000;
                    }
                    var bGameId = web3.fromAscii(String(response.data[0]._id));
                    Rpsls.deployed().then((instance) => {
                        instance.createGame(bGameId, randomAgent, fromObj).then(() => {
                            window.location.href = '/';
                        }).catch((err) => {
                            alert(err);
                        });
                    });
                });
            },
            error: function(response) {
                alert(response.responseText);
            }
        });
    });
    $('#gameTable').on('click', '.joinButton', function() {
        setCookie('gameId',$(this).attr('gameId'),1);
        var joinUrl = "/player/"+getCookie('playerId')+"/join/"+$(this).attr('gameId');
        $.ajax({
            type: "POST",
            url: joinUrl,
            success: function(response) {
                web3.eth.getCoinbase(function(err,res){
                    var fromObj = {};
                    fromObj.from = res;
                    fromObj.value = 100000000000000;
                    var bGameId = web3.fromAscii(getCookie('gameId'));
                    Rpsls.deployed().then((instance) => {
                        instance.joinGame(bGameId,fromObj).then(() => {
                            window.location.href='/play';
                        }).catch((err) => {
                            console.log(err);
                        });
                    });
                });
            },
            error: function(response) {
                console.log(response);
                alert(response.responseJSON.msg);
            }
        });
    });
});