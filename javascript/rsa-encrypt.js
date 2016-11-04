function RSAEncrypt(publicKey) {


    var longueurChaineEncode = 32;


    publicKey = publicKey.replace(' ', '').split(',');
    var e = bigInt(publicKey[0], 35), n = bigInt(publicKey[1], 35);

    this.encrypt = function(string) {
        var stringLength = string.length;
        var asciiString = '';
        for(var i=0; i < stringLength; i++) {
            var chrAscii = string.charCodeAt(i);
            
            if(chrAscii < 1)
                chrAscii = '000';
            else if(chrAscii < 10)
                chrAscii = '00' + chrAscii;
            else if(chrAscii < 100)
                chrAscii = '0' + chrAscii;

            asciiString += chrAscii;
        }

        for(var i = longueurChaineEncode - (asciiString.length % longueurChaineEncode); i > 0; i--) {
            asciiString = asciiString + '0';
        }
        console.log(asciiString);
        var asciiStringLength = asciiString.length;
        var msgEncrypted = '';
        for(var i=0; i < asciiStringLength; i+=longueurChaineEncode) {
            msgEncrypted += bigInt(asciiString.substr(i, longueurChaineEncode)).modPow(e, n).toString(35) + ' ';
        }
        return msgEncrypted.trim();
    }
}