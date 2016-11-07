function RSA(keys) {

    var longueurChaineEncode = 32, objectKeys = {},
        bigInt0 = bigInt(0), bigInt1 = bigInt(1), bigInt2 = bigInt(2),
        bigInt3 = bigInt(3), bigInt5 = bigInt(5), bigInt7 = bigInt(7),
        bigInt10 = bigInt(10), bigInt100000 = bigInt(100000);



    if(keys != undefined) {
        if (keys.publicKey != undefined) {
            var publicKey = keys.publicKey.replace(' ', '').split(',');
            objectKeys.publicE = bigInt(publicKey[0], 35);
            objectKeys.publicN = bigInt(publicKey[1], 35);
        }
        if (keys.privateKey != undefined) {
            var privateKey = keys.privateKey.replace(' ', '').split(',');
            objectKeys.privateD = bigInt(privateKey[0], 35);
            objectKeys.privateN = bigInt(privateKey[1], 35);
        }
    }




    function euclideEtendu(a, b) {
        var r = a, r2 = b, u = bigInt1, u2 = bigInt0, v = bigInt0, v2 = bigInt1;
        while(r2.notEquals(0)) {
            var q = r.divide(r2), rs = r, us = u, vs = v;
            r = r2; u = u2; v = v2;
            r2 = rs.subtract(q.multiply(r2));
            u2 = us.subtract(q.multiply(u2));
            v2 = vs.subtract(q.multiply(v2));
        }
        return {r : r, u : u, v : v};
    }
    function findED(firstPN, secondPN, qn) {
        var i = firstPN.add(bigInt1);
        if(i.lesserOrEquals(secondPN))
            i = secondPN.add(bigInt1);

        while(1) {
            var ruv = euclideEtendu(qn, i);

            if(ruv.r == 1) {
                if(ruv.v.lesser(bigInt0)) {
                    var tmpV = ruv.v.subtract(ruv.v.divide(qn).subtract(bigInt1).multiply(qn));
                    if(tmpV.lesser(bigInt2)) { tmpV = ruv.v.subtract(ruv.v.divide(qn).subtract(bigInt2).multiply(qn)); }
                    ruv.v = tmpV;
                }
                return {e : i, d : ruv.v};
            }
            i = i.add(bigInt1);
        }
    }
    function temoinMiller(n, k) {
        if(n.equals(bigInt2) || n.equals(bigInt3) || n.equals(bigInt5) || n.equals(bigInt7))
            return true;

        if( n.lesser(2) || n.mod(bigInt2).equals(bigInt0) || n.mod(bigInt3).equals(bigInt0) || n.mod(bigInt5).equals(bigInt0) || n.mod(bigInt7).equals(bigInt0))
            return false;

        var nSubtract1 = n.subtract(bigInt1), s = bigInt0, d = nSubtract1;
        while (d.mod(bigInt2).equals(bigInt0)) {
            d = d.divide(bigInt2);
            s = s.add(bigInt1);
        }

        var sSubtract1 = s.subtract(bigInt1);

        MillerLoop: do {
            var x = bigInt2.add(bigInt(Math.floor(Math.random() * 100000)).multiply(n.subtract(bigInt3)).divide(bigInt100000)).modPow(d, n);

            if (x.equals(bigInt1) || x.equals(nSubtract1))
                continue;

            for (var i = sSubtract1; i.notEquals(bigInt0); i = i.subtract(bigInt1)) {
                x = x.modPow(bigInt2, n);
                if (x.equals(bigInt1))
                    return false;
                if (x.equals(nSubtract1))
                    continue MillerLoop;
            }

            return false;
        } while (--k);

        return true;
    }









    this.generatePrimeNumber = function(nbBit) {
        var bigPrime = bigInt.randBetween(bigInt2.pow(bigInt(nbBit-1)), bigInt2.pow(bigInt(nbBit)).subtract(bigInt1));

        if(bigPrime.isEven())
            bigPrime = bigPrime.add(bigInt1);

        while(!temoinMiller(bigPrime, 10))
            bigPrime = bigPrime.add(bigInt2);

        return bigPrime.toString(35);
    };





    this.findKey = function(firstPrimeNumber, secondPrimeNumber) {
        var p = bigInt(firstPrimeNumber, 35), q = bigInt(secondPrimeNumber, 35);

        if(!temoinMiller(p, 10) || !temoinMiller(q, 10)) {
            console.error('RSA.findKey : Unable to find public and private keys. The params are\'nt prime number.');
            return false;
        }

        var n = p.multiply(q), qn = p.subtract(bigInt1).multiply(q.subtract(bigInt1)), ed = findED(p, q, qn);

        return {
            publicKey : ed.e.toString(35) + ', ' + n.toString(35),
            privateKey : ed.d.toString(35) + ', ' + n.toString(35)
        };
    };






    this.encrypt = function(string) {

        if(objectKeys.publicE == undefined || objectKeys.publicN == undefined) {
            console.error('RSA.encrypt : Unable to encrypt string. Public key not defined.');
            return false;
        }

        var stringLength = string.length, asciiString = '';
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

        var asciiStringLength = asciiString.length, msgEncrypted = '';
        for(var i=0; i < asciiStringLength; i+=longueurChaineEncode) {
            msgEncrypted += bigInt(asciiString.substr(i, longueurChaineEncode)).modPow(objectKeys.publicE, objectKeys.publicN).toString(35) + ' ';
        }
        return msgEncrypted.trim();
    };






    this.decrypt = function(string) {
        if(objectKeys.privateD == undefined || objectKeys.privateN == undefined) {
            console.error('RSA.decrypt : Unable to decrypt string. Private key not defined.');
            return false;
        }

        var intToDecrypt = string.trim().split(' '), initialChainChar = '';

        for(var i in intToDecrypt) {
            var intChar = bigInt(intToDecrypt[i], 35).modPow(objectKeys.privateD, objectKeys.privateN),
                stringChar = intChar.toString(10);

            for(var j=0; j < longueurChaineEncode; j++) {
                if(intChar.lesser(bigInt10.pow(bigInt(j)))) {
                    for(var k=j; k < longueurChaineEncode; k++)
                        stringChar = '0' + stringChar;
                    break;
                }
            }

            initialChainChar += stringChar;
        }

        var initialChainCharLength = initialChainChar.length, decryptedChain = '';
        for(var i=0; i < initialChainCharLength; i+=3) {
            var charCode = parseInt(initialChainChar.substr(i, 3), 10);
            if(charCode != 0) decryptedChain += String.fromCharCode(charCode);
        }

        return decryptedChain;
    };

}