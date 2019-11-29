var rpsls = artifacts.require("Rpsls");
contract('Rpsls ::: Test 1',function(accounts){
  const playerA = accounts[0];
//   const playerB = accounts[1];
  let gameId = web3.utils.fromAscii("random");
//   let secret;
//   let salt1,salt2;
//   salt1 = "hello";
//   salt2 = "hello";
//   let status, gridSize, targetIndex, owner, challenger, turn, winner, funds;
  it("should not return exception",async () => {
      const bs = await rpsls.deployed();
    //   const val = await web3.utils.toWei("1");
      await bs.createGame(gameId, false);
      await bs.joinGame(gameId,{from:playerA, value:100000000000000});
      assert(true,"WHAAAT?");
  });

});
