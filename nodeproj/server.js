var express = require('express'),
    Web3 = require('web3'),
    bodyParser = require('body-parser'),
    app = express(),
    fs = require('fs'),
    path = require('path');

contractAddress = "0x76d177a05b4ddc8d398e09ecd4ea51527af7d1de";
ABIArray = [{"constant":true,"inputs":[{"name":"addr","type":"address"},{"name":"subscriptionNumber","type":"uint8"}],"name":"querySubscription","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"subscriptionNumber","type":"uint8"}],"name":"subscribe","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"finishSubscribing","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"subscriptionNumber","type":"uint8"},{"name":"cost","type":"uint256"}],"name":"setSubscriptionCost","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"subscribingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"subscriptionNumber","type":"uint8"}],"name":"unsubscribe","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"subscriber","type":"address"},{"indexed":false,"name":"subscriptionNumber","type":"uint8"}],"name":"SubsLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"subscriber","type":"address"},{"indexed":false,"name":"subscriptionNumber","type":"uint8"}],"name":"UnsubsLog","type":"event"}];

var contractInstance;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static('views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.post('/', function (req, res) {
    var address = req.body.address;
    var list = req.body.IDlist;
    console.log("**** " + address);
    if (isAddress(address) && Number.isInteger(parseInt(list))) {
        // test the subscription on the blockchain
        contractInstance.methods.querySubscription(address, list).call().then(function (result) {
            if (result == true) {
                if (list == 0) {
                    res.render("top_unlock.html");
                } else {
                    res.render("get.html");
                }
            } else {
                if (list == 0) {
                    res.render("subscribe1.html");
                } else {
                    res.render("subscribe2.html");
                }
            };
        });
    } else {
        html = '<!DOCTYPE html><html><head><title>Awesome list</title></head><body>';
        html += '<h1>Address not valid. Unlock your MetaMask/Mist client.</h1>'
        html += '<FORM><INPUT Type="button" VALUE="Back" onClick="history.go(-1);return true;"></FORM>';
        html += '</body></html>';
        res.send(html)
    }
});

var isAddress = function (address) {
    // function isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return "true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
}


var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x', '');
    var addressHash = web3.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
}

app.listen(8765, function () {
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));
    contractInstance = new web3.eth.Contract(ABIArray, contractAddress);
    //contractInstance = VotingContract.at(contractAddress);
});
