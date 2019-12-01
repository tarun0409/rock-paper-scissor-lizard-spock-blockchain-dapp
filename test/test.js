var rpsls = artifacts.require("Rpsls");
contract('Rpsls ::: Test 1',function(accounts){
  const playerA = accounts[0];
  const playerB = accounts[1];
  let gameId = web3.utils.fromAscii("random");
  let gameId2 = web3.utils.fromAscii("random2");
  it("should be able to create a game",async () => {
      const bs = await rpsls.deployed();
      await bs.createGame(gameId, false, {from:playerA});
      var gameOpen = await bs.gameOpen(gameId,{from:playerA});
      assert(gameOpen,"Game is supposed to be in OPEN status");
  });
  it("two players should be able to join a game", async () => {
      const bs = await rpsls.deployed();
      await bs.joinGame(gameId,{from:playerA, value:100000000000000});
      await bs.joinGame(gameId,{from:playerB, value:100000000000000});
      var gameStarted = await bs.gameStarted(gameId,{from:playerA});
      assert(gameStarted,"Game is supposed to be in started status");
  });
  it("player should be able to make a move", async () => {
    const bs = await rpsls.deployed();
    var player1MoveHash = web3.utils.soliditySha3("1player1Nonce");
    var player2MoveHash = web3.utils.soliditySha3("2player2Nonce");
    await bs.move(gameId, player1MoveHash, {from:playerA});
    await bs.move(gameId, player2MoveHash, {from:playerB});
    var bothPlayersPlayed = await bs.bothPlayersMoved(gameId,{from:playerA});
    assert(bothPlayersPlayed,"One or more players dont appeared to have played");
  });
  it("player should be able to reveal", async () => {
    const bs = await rpsls.deployed();
    await bs.reveal(gameId, "player1Nonce",{from:playerA});
    await bs.reveal(gameId, "player2Nonce",{from:playerB});
    var bothPlayersRevealed = await bs.bothPlayersRevealed(gameId,{from:playerA});
    assert(bothPlayersRevealed,"One or more players dont appeared to have revealed");
  });
  it("should be able to get winner", async () => {
    const bs = await rpsls.deployed();
    var exceptionOccurred = false;
    try
    {
      var winner = await bs.getWinner(gameId, {from:playerA});
    }
    catch(err)
    {
      exceptionOccurred = true;
    }
    assert(!exceptionOccurred, "Something went wrong while getting winner");
  });
  it("winner should be actual winner", async () => {
    const bs = await rpsls.deployed();
    var winner = await bs.getWinner(gameId, {from:playerA});
    assert(winner === playerB,"Winner is not player 2");
  });
  it("should be able to create a game against random player",async () => {
    const bs = await rpsls.deployed();
    await bs.createGame(gameId2, true, {from:playerA, value:100000000000000});
    var gameOpen = await bs.gameOpen(gameId2,{from:playerA});
    assert(gameOpen,"Game is supposed to be in OPEN status");
  });
  it("should be able to join a random agent game", async () => {
    const bs = await rpsls.deployed();
    await bs.joinGame(gameId2,{from:playerB, value:100000000000000});
    var player = await bs.getPlayerOne(gameId2,{from:playerA});
    assert(player === playerB,"Player not registered");
  });
  it("player should be able to make a move against random agent", async () => {
    const bs = await rpsls.deployed();
    var player1MoveHash = web3.utils.soliditySha3("1player1Nonce");
    await bs.move(gameId2, player1MoveHash, {from:playerB});
    var bothPlayersPlayed = await bs.bothPlayersMoved(gameId2,{from:playerA});
    assert(bothPlayersPlayed,"One or more players dont appeared to have played");
  });
  it("player should be able to reveal in random agent game", async () => {
    const bs = await rpsls.deployed();
    await bs.reveal(gameId2, "player1Nonce",{from:playerB});
    var bothPlayersRevealed = await bs.bothPlayersRevealed(gameId2,{from:playerA});
    assert(bothPlayersRevealed,"One or more players dont appeared to have revealed");
  });
  it("should be able to get winner in random agent game", async () => {
    const bs = await rpsls.deployed();
    var exceptionOccurred = false;
    try
    {
      var winner = await bs.getWinner(gameId2, {from:playerA});
    }
    catch(err)
    {
      exceptionOccurred = true;
    }
    assert(!exceptionOccurred, "Something went wrong while getting winner");
  });

});
