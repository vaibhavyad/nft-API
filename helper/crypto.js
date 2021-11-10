const crypto = require("crypto");
const hash = crypto.createHash('sha256');
// const password = 'bafkreiazkoqwn4sxar7f4f66ic6zuneqgpvh2ym4cwxetc7mk4dyyym55e';


const encrypt = (text, password) => {


    const passwordHash = crypto.createHash('sha256').update(password).digest();
    const secretKey = Buffer.from(passwordHash).toString('hex', 16);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    
    // console.log("aaaaaaaa",iv.toString('hex') + ':' + encrypted.toString('hex'));
    // return {
    //     iv: iv.toString('hex'),
    //     content: encrypted.toString('hex')
    // };

     return iv.toString('hex') + ':' + encrypted.toString('hex')

};

// Decryption
const decrypt = (hash, password) => {

    // Creaate a buffered secretKey from the password
    const passwordHash = crypto.createHash('sha256').update(password).digest();
    const secretKey = Buffer.from(passwordHash).toString('hex', 16);
   
    var encryptedArr = hash.split(":")

    const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(encryptedArr[0], 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(encryptedArr[1], 'hex')), decipher.final()]);
    
    // console.log('decypted', decrpyted.toString());

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};

