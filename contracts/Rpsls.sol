pragma solidity >=0.4.22 <0.6.0;

contract Rpsls
{
    enum GameStatus { NONEXISTENT, OPEN, STARTED, CLOSED }
    struct Game
    {
        GameStatus status;
        address payable player1;
        address payable player2;
        address payable winner;
        bool randomAgent;
        uint256 bounty;
        bytes32 player1Hash;
        bytes32 player2Hash;
        bool player1Played;
        bool player2Played;
        string player1Nonce;
        string player2Nonce;
        bool player1Revealed;
        bool player2Revealed;
    }
    address payable private owner;
    mapping (bytes32 => Game) private games;
    uint private bidAmount = 0.0001 ether;
    bytes32 gId;

    modifier gameDoesNotExist(bytes32 gameId)
    {
        require(games[gameId].status == GameStatus.NONEXISTENT, "Game already exists");
        _;
    }

    modifier gameIsOpen(bytes32 gameId)
    {
        require(games[gameId].status == GameStatus.OPEN, "Game is not open");
        _;
    }

    modifier gameIsStarted(bytes32 gameId)
    {
        require(games[gameId].status == GameStatus.STARTED, "Game is not started");
        _;
    }

    modifier bothPlayersPlayed(bytes32 gameId)
    {
        require(games[gameId].player1Played && games[gameId].player2Played, "Both players need to play");
        _;
    }

    modifier gameIsClosed(bytes32 gameId)
    {
        require(games[gameId].status == GameStatus.CLOSED, "Game not open or started");
        _;
    }

    function bothPlayersRevealed(bytes32 gameId) public view returns(bool)
    {
        return games[gameId].player1Revealed && games[gameId].player2Revealed;
    }

    function random() private view returns(uint)
    {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%5) + 1;
    }

    function createGame(bytes32 gameId, bool randomAgent) public payable gameDoesNotExist(gameId)
    {
        require(!randomAgent || (randomAgent && msg.value >= bidAmount), "Bid atleast 0.0001 ether");
        games[gameId].status = GameStatus.OPEN;
        owner = msg.sender;
        games[gameId].randomAgent = randomAgent;
        games[gameId].bounty += msg.value;
    }

    function joinGame(bytes32 gameId) public payable gameIsOpen(gameId)
    {
        require (msg.value >= bidAmount,"Bid atleast 0.0001 ether");
        if(games[gameId].player1 == address(0))
        {
            games[gameId].player1 = msg.sender;
            if(games[gameId].randomAgent)
            {
                games[gameId].player2 = owner;
                games[gameId].status = GameStatus.STARTED;
            }
        }
        else
        {
            games[gameId].player2 = msg.sender;
            games[gameId].status = GameStatus.STARTED;
        }
        games[gameId].bounty += msg.value;
    }

    function move(bytes32 gameId, bytes32 moveHash) public gameIsStarted(gameId)
    {
        if(games[gameId].player1 == msg.sender)
        {
            games[gameId].player1Hash = moveHash;
            games[gameId].player1Played = true;
            if(games[gameId].randomAgent)
            {
                uint randNum = random();
                if(randNum == 1)
                {
                    games[gameId].player2Hash = keccak256(abi.encodePacked("1", "randomnonce"));
                }
                else if(randNum == 2)
                {
                    games[gameId].player2Hash = keccak256(abi.encodePacked("2", "randomnonce"));
                }
                else if(randNum == 3)
                {
                    games[gameId].player2Hash = keccak256(abi.encodePacked("3", "randomnonce"));
                }
                else if(randNum == 4)
                {
                    games[gameId].player2Hash = keccak256(abi.encodePacked("4", "randomnonce"));
                }
                else
                {
                    games[gameId].player2Hash = keccak256(abi.encodePacked("5", "randomnonce"));
                }
                games[gameId].player2Played = true;
            }
        }
        else if(games[gameId].player2 == msg.sender)
        {
            games[gameId].player2Hash = moveHash;
            games[gameId].player2Played = true;
        }
    }

    function withdraw() private
    {
        bytes32 player1RockHash = keccak256(abi.encodePacked("1", games[gId].player1Nonce));
        bytes32 player1PaperHash = keccak256(abi.encodePacked("2", games[gId].player1Nonce));
        bytes32 player1ScissorHash = keccak256(abi.encodePacked("3", games[gId].player1Nonce));
        bytes32 player1LizardHash = keccak256(abi.encodePacked("4", games[gId].player1Nonce));
        bytes32 player1SpockHash = keccak256(abi.encodePacked("5", games[gId].player1Nonce));
        bytes32 player2RockHash = keccak256(abi.encodePacked("1", games[gId].player2Nonce));
        bytes32 player2PaperHash = keccak256(abi.encodePacked("2", games[gId].player2Nonce));
        bytes32 player2ScissorHash = keccak256(abi.encodePacked("3", games[gId].player2Nonce));
        bytes32 player2LizardHash = keccak256(abi.encodePacked("4", games[gId].player2Nonce));
        bytes32 player2SpockHash = keccak256(abi.encodePacked("5", games[gId].player2Nonce));
        if(games[gId].player1Hash == player1RockHash)
        {
            if(games[gId].player2Hash == player2LizardHash || games[gId].player2Hash == player2ScissorHash)
            {
                games[gId].winner = games[gId].player1;
            }
            else if(games[gId].player2Hash == player2RockHash)
            {
                games[gId].winner = owner;
            }
            else
            {
                games[gId].winner = games[gId].player2;
            }
        }
        else if(games[gId].player1Hash == player1PaperHash)
        {
            if(games[gId].player2Hash == player2RockHash || games[gId].player2Hash == player2SpockHash)
            {
                games[gId].winner = games[gId].player1;
            }
            else if(games[gId].player2Hash == player2PaperHash)
            {
                games[gId].winner = owner;
            }
            else
            {
                games[gId].winner = games[gId].player2;
            }
        }
        else if(games[gId].player1Hash == player1ScissorHash)
        {
            if(games[gId].player2Hash == player2PaperHash || games[gId].player2Hash == player2LizardHash)
            {
                games[gId].winner = games[gId].player1;
            }
            else if(games[gId].player2Hash == player2ScissorHash)
            {
                games[gId].winner = owner;
            }
            else
            {
                games[gId].winner = games[gId].player2;
            }
        }
        else if(games[gId].player1Hash == player1LizardHash)
        {
            if(games[gId].player2Hash == player2PaperHash || games[gId].player2Hash == player2SpockHash)
            {
                games[gId].winner = games[gId].player1;
            }
            else if(games[gId].player2Hash == player2LizardHash)
            {
                games[gId].winner = owner;
            }
            else
            {
                games[gId].winner = games[gId].player2;
            }
        }
        else if(games[gId].player1Hash == player1SpockHash)
        {
            if(games[gId].player2Hash == player2ScissorHash || games[gId].player2Hash == player2RockHash)
            {
                games[gId].winner = games[gId].player1;
            }
            else if(games[gId].player2Hash == player2LizardHash)
            {
                games[gId].winner = owner;
            }
            else
            {
                games[gId].winner = games[gId].player2;
            }
        }
        games[gId].winner.transfer(games[gId].bounty);
        games[gId].status = GameStatus.CLOSED;
    }

    function reveal(bytes32 gameId, string memory nonce) public gameIsStarted(gameId) bothPlayersPlayed(gameId)
    {
        if(games[gameId].player1 == msg.sender)
        {
            games[gameId].player1Nonce = nonce;
            games[gameId].player1Revealed = true;
            if(games[gameId].randomAgent)
            {
                games[gameId].player2Nonce = "randomnonce";
                games[gameId].player2Revealed = true;
            }
        }
        else if(games[gameId].player2 == msg.sender)
        {
            games[gameId].player2Nonce = nonce;
            games[gameId].player2Revealed = true;
        }
        if(bothPlayersRevealed(gameId))
        {
            // Game storage game = games[gameId];
            gId = gameId;
            withdraw();
        }
    }

    function getWinner(bytes32 gameId) public view gameIsClosed(gameId) returns(address)
    {
        return games[gameId].winner;
    }

    //Following functions for testing purposes

    function gameOpen(bytes32 gameId) public view returns(bool)
    {
        return games[gameId].status == GameStatus.OPEN;
    }
    function gameStarted(bytes32 gameId) public view returns(bool)
    {
        return games[gameId].status == GameStatus.STARTED;
    }
    function bothPlayersMoved(bytes32 gameId) public view returns(bool)
    {
        return games[gameId].player1Played && games[gameId].player2Played;
    }
    function getPlayerOne(bytes32 gameId) public view returns(address)
    {
        return games[gameId].player1;
    }

}