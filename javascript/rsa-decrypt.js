function RSADecrypt(privateKey) {


    var longueurChaineEncode = 32;
    
    
    privateKey = privateKey.replace(' ', '').split(',');
    var d = bigInt(privateKey[0], 35), n = bigInt(privateKey[1], 35);


    this.decrypt = function(string) {
        var intToDecrypt = string.trim().split(' ');
        var initialChainChar = '';
        var bigInt10 = bigInt(10);
        for(var i in intToDecrypt) {
            var intChar = bigInt(intToDecrypt[i], 35).modPow(d, n);
            var stringChar = intChar.toString(10);
            for(var j=0; j < longueurChaineEncode; j++) {
                if(intChar.lesser(bigInt10.pow(bigInt(j)))) {
                    for(var k=j; k < longueurChaineEncode; k++)
                        stringChar = '0' + stringChar;
                    break;
                }
            }
            initialChainChar += stringChar;
        }

        console.log(initialChainChar);

        var initialChainCharLength = initialChainChar.length;
        var decryptedChain = '';
        for(var i=0; i < initialChainCharLength; i+=3) {
            var charCode = parseInt(initialChainChar.substr(i, 3), 10);
            if(charCode != 0) decryptedChain += String.fromCharCode(charCode);
        }

        return decryptedChain;
    }
}
