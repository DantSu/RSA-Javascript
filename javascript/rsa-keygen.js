function RSAKeygen () {
    var bigInt0 = bigInt(0), bigInt1 = bigInt(1), bigInt2 = bigInt(2), bigInt3 = bigInt(3), bigInt100000 = bigInt(100000);

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
            var ruv = euclideEtendu(qn, i)

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
        if(n.equals(bigInt2) || n.equals(bigInt3))
            return true;

        if(n.mod(bigInt2).equals(bigInt0) || n.lesser(2))
            return false;

        var nSubtract1 = n.subtract(bigInt1), s = bigInt0, d = nSubtract1;
        while (d.mod(bigInt2).equals(0)) {
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
        
        //while(!bigPrime.isProbablePrime())
        //    bigPrime = bigPrime.add(bigInt2);
        while(!temoinMiller(bigPrime, 10))
            bigPrime = bigPrime.add(bigInt2);

        return bigPrime.toString(35);
    }

    this.findKey = function(firstPrimeNumber, secondPrimeNumber) {
        var p = bigInt(firstPrimeNumber, 35);
        var q = bigInt(secondPrimeNumber, 35);

        if(!p.isProbablePrime() || !q.isProbablePrime()) {
            alert('It\'s not a prime number.');
            return false;
        }

        var n = p.multiply(q);
        var qn = p.subtract(bigInt1).multiply(q.subtract(bigInt1));
        var ed = findED(p, q, qn);

        return {
            publicKey : ed.e.toString(35) + ', ' + n.toString(35),
            privateKey : ed.d.toString(35) + ', ' + n.toString(35)
        };
    }


}