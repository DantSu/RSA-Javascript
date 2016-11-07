function onGeneratePrimeNumber(form) {
    var rsa = new RSA();
    form.first_prime_number.value = rsa.generatePrimeNumber(512);
    form.second_prime_number.value = rsa.generatePrimeNumber(512);
    
    return false;
}

function onGenerateKeySubmit(form) {
    var rsa = new RSA();
    var key = rsa.findKey(form.first_prime_number.value, form.second_prime_number.value);

    form.public_key.value = key.publicKey;
    form.private_key.value = key.privateKey;

    return false;
}

function onEncryptSubmit(form) {
    if(document.getElementById('public_key').value == '') {
        alert('Public key it isn\'t defined.');
        return false;
    }

    var rsa = new RSA({publicKey:document.getElementById('public_key').value});
    form.text_encrypted.value = rsa.encrypt(form.text_to_encrypt.value);
    return false;
}

function onDecryptSubmit(form) {
    if(document.getElementById('private_key').value == '') {
        alert('Private key it isn\'t defined.');
        return false;
    }

    var rsa = new RSA({privateKey:document.getElementById('private_key').value});
    form.text_decrypted.value = rsa.decrypt(form.text_to_decrypt.value);
    return false;
}