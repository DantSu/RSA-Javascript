function onGeneratePrimeNumber(form) {
    var rsaKeygen = new RSAKeygen();
    form.first_prime_number.value = rsaKeygen.generatePrimeNumber(512);
    form.second_prime_number.value = rsaKeygen.generatePrimeNumber(512);
    
    return false;
}

function onGenerateKeySubmit(form) {
    var rsaKeygen = new RSAKeygen();
    var key = rsaKeygen.findKey(form.first_prime_number.value, form.second_prime_number.value);

    form.public_key.value = key.publicKey;
    form.private_key.value = key.privateKey;

    return false;
}

function onEncryptSubmit(form) {
    if(document.getElementById('public_key').value == '')
        return false;

    var rsaEncrypt = new RSAEncrypt(document.getElementById('public_key').value);
    form.text_encrypted.value = rsaEncrypt.encrypt(form.text_to_encrypt.value);
    return false;
}

function onDecryptSubmit(form) {
    if(document.getElementById('private_key').value == '') {
        alert('Private key it\'s');
        return false;
    }

    var rsaDecrypt = new RSADecrypt(document.getElementById('private_key').value);
    form.text_decrypted.value = rsaDecrypt.decrypt(form.text_to_decrypt.value);
    return false;
}