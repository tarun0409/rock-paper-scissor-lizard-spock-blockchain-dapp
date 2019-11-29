$(document).ready(function(){
    if (typeof web3 !== 'undefined') 
    {
        web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(web3Provider);
    }
    Rpsls = null;
    $.ajax({
        type:"GET",
        url:"/contract",
        success: function(response){
            Rpsls = TruffleContract(response.contract);
            Rpsls.setProvider(web3Provider);
        },
        error: function(response) {
            window.location.href='/login';
        }
    });
});