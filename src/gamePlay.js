$(document).ready(function(){
    if(getCookie('playerId') == null || getCookie('playerId')=='null' || getCookie('playerId')==='null')
    {
        window.location.href='/login';
        return;
    }
    if(getCookie('gameId') == null || getCookie('gameId')=='null' || getCookie('gameId')==='null')
    {
        window.location.href='/';
        return;
    }
    $("#moveSubmit").click(function(){
        var move = $("#moveSelect").val();
        var nonce = $("#nonce").val();
        if(nonce === "" || nonce == "" || nonce == null)
        {
            alert("Please enter nonce!");
            return;
        }
        var moveHash = web3.sha3(move+nonce);
        web3.eth.getCoinbase(function(err,res){
            var fromObj = {};
            fromObj.from = res;
            var bGameId = web3.fromAscii(getCookie('gameId'));
            Rpsls.deployed().then((instance) => {
                instance.move(bGameId, moveHash, fromObj).then(() => {
                    window.location.href='/play';
                }).catch((err) => {
                    alert(err);
                });;
            });
        });
    });

    $("#reveal").click(function(){
        var nonce = prompt("Enter nonce");
        web3.eth.getCoinbase(function(err,res){
            var fromObj = {};
            fromObj.from = res;
            var bGameId = web3.fromAscii(getCookie('gameId'));
            Rpsls.deployed().then((instance) => {
                instance.reveal(bGameId, nonce, fromObj).then(() => {
                    window.location.href='/play';
                }).catch((err) => {
                    console.log(err);
                });
            });
        });
    });

    $("#showWinner").click(function(){
        web3.eth.getCoinbase(function(err,res){
            var fromObj = {};
            fromObj.from = res;
            var bGameId = web3.fromAscii(getCookie('gameId'));
            Rpsls.deployed().then((instance) => {
                instance.getWinner(bGameId, fromObj).then((winner) => {
                    web3.eth.getCoinbase(function(err,res){
                        if(res === winner)
                        {
                            alert("Congratulations! You won!");
                        }
                        else
                        {
                            alert("Sorry. You lost.")
                        }
                    });
                }).catch((err) => {
                    console.log(err);
                });
            });
        });
    });

    $("#gamePage").click(function(){
        window.location.href = "/";
    });
});